import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { faker } from '@test/faker';
import { config } from 'dotenv';
import path from 'path';
import { CartController } from '@/modules/carts/controllers/cart.controller';
import { getModelToken } from '@nestjs/sequelize';
import { CartService } from '@/modules/carts/services/cart.service';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { CartInterface } from '@/modules/carts/schemas/cart.schema';
import * as models from '@/modules/_global/config/models';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Product, ProductInterface } from '@/modules/products/schemas/product.schema';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { CartStatusEnum } from '@modules/carts/enums/cart.status.enum';
import { v4 as uuidv4 } from 'uuid';

describe('Cart', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Cart;
  let repositoryProduct: typeof Product;
  let app: NestFastifyApplication;
  const imageUrls = [
    'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
    'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/71kr3WAj1FL._AC_UL640_QL65_.jpg',
    'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71g2ednj0JL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/61SBmAP8GvL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71Y5Q7e-6RL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71kWymZ+c+L._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/51eg55uWmdL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
];
  config({
    path: path.resolve(process.cwd(), '.env.testing'),
  });
  beforeEach(async () => {
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync();
    repositoryManager = sequelize.models['Cart'] as typeof Cart;
    repositoryProduct = sequelize.models['Product'] as typeof Product;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: getModelToken(Cart),
          useValue: repositoryManager,
        },
        {
          provide: getModelToken(Product),
          useValue: repositoryProduct,
        },
        CartService,
        CartRepository,
        ProductRepository,
      ],
      imports: [
        ...SequelizeTestingModule(Object.values(models)),
      ],
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });
  describe('Cart List', () => {

    describe('List cart', () => {
      describe('List cart with elements', () => {
        it(' (GET)', async () => {
          const numRecords = faker.number.int({ min: 1, max: 10 });
          const createDtos = await Promise.all(
            Array.from({ length: numRecords }, async () => {
              const productDto: Partial<Product> = {
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
                stock: faker.number.int({ min: 1, max: 100 }),
                imageURL: faker.helpers.arrayElement(imageUrls),
              };
              const product = await repositoryProduct.create(<ProductInterface>productDto);
              const plainProduct: Product = JSON.parse(JSON.stringify(product));

              return {
                stock: faker.number.int({ min: 1, max: plainProduct.stock }),
                productId: plainProduct.id,
              };
            })
        );
          const types = await Promise.all(
            createDtos.map((dto) =>
              repositoryManager.create(<CartInterface>dto),
            ),
          );
          const carts = JSON.parse(JSON.stringify(types));
          const response = await request(app.getHttpServer())
            .get('/cart')
            .expect(HttpStatus.OK);
          expect(response.body).toHaveLength(numRecords);
          expect(response.body).toEqual(
            expect.arrayContaining(
              carts.map((cart: Cart) =>
                expect.objectContaining({
                  id: cart.id,
                  stock: cart.stock,
                  status: cart.status,
                  productId: cart.productId,
                  createdAt: cart.createdAt,
                  updatedAt: cart.updatedAt,
                }),
              ),
            ),
          );
        });
      });

      describe('List cart empty', () => {
        it(' (GET)', async () => {
          const response = await request(app.getHttpServer())
            .get('/cart')
            .expect(HttpStatus.OK);
          expect(response.body.length).toBe(0);
        });
      });
    });

    describe('create cart', () => {
      describe('create cart 201', () => {
        it('/cart (POST)', async () => {
          const productDto: Partial<Product> = {
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
            stock: faker.number.int({ min: 1, max: 100 }),
            imageURL: faker.helpers.arrayElement(imageUrls),
          };
          const product = await repositoryProduct.create(<ProductInterface>productDto);
          const plainProduct: Product = JSON.parse(JSON.stringify(product));
          const createDto = {
            stock: faker.number.int({ min: 1, max: plainProduct.stock }),
            productId: plainProduct.id,
          };
          const response = await request(app.getHttpServer())
            .post('/cart')
            .send(createDto)
            .expect(HttpStatus.CREATED);

          expect(response.body).toMatchObject({
            id: expect.any(String),
            stock: createDto.stock,
            status: CartStatusEnum.PENDING,
            productId: createDto.productId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });
      describe('create cart fail', () => {
        it('/cart (POST)', async () => {
          await request(app.getHttpServer())
            .post('/cart')
            .expect(HttpStatus.BAD_REQUEST);
        });
      });
    });

    describe('Update cart', () => {
      it('/cart/:id (PATCH)', async () => {
        const productDto: Partial<Product> = {
          name: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          stock: faker.number.int({ min: 1, max: 100 }),
          imageURL: faker.helpers.arrayElement(imageUrls),
        };
        const product = await repositoryProduct.create(<ProductInterface>productDto);
        const plainProduct: Product = JSON.parse(JSON.stringify(product));
        const createDto = {
          stock: faker.number.int({ min: 1, max: plainProduct.stock }),
          productId: plainProduct.id,
        };
        const cart = await repositoryManager.create(
          <CartInterface>createDto,
        );
        const cartId = cart.id;
        const updateDto = {
          stock: faker.number.int({ min: 1, max: plainProduct.stock }),
          status: CartStatusEnum.FINISHED,
        };

        const updateResponse = await request(app.getHttpServer())
          .patch(`/cart/${cartId}`)
          .send(updateDto);
        const updatedCart = await repositoryManager.findByPk(cartId);
        const result = JSON.parse(JSON.stringify(updatedCart));
        expect(result).toMatchObject({
          id: cartId,
          stock: updateDto.stock,
          status: updateDto.status,
          productId: createDto.productId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
        expect(updateResponse.body).toEqual([null, 1]);
      });

      it('/cart/:id (PATCH) fail', async () => {
        const cartId = uuidv4();
        const updateDto = {
          stock: faker.number.int({ min: 1, max: 100 }),
          status: CartStatusEnum.FINISHED,
        };

        await request(app.getHttpServer())
          .patch(`/cart/${cartId}`)
          .send(updateDto)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });
});
