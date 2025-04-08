// Importaciones necesarias de NestJS, Sequelize, Supertest y utilidades
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

  // Imágenes de prueba para los productos
  const imageUrls = [
    'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
    'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
  ];

  // Cargamos las variables de entorno para el entorno de testing
  config({
    path: path.resolve(process.cwd(), '.env.testing'),
  });

  // Hook que se ejecuta antes de cada prueba
  beforeEach(async () => {
    // Inicializa Sequelize con todos los modelos
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync();

    // Referencias a los modelos
    repositoryManager = sequelize.models['Cart'] as typeof Cart;
    repositoryProduct = sequelize.models['Product'] as typeof Product;

    // Creamos el módulo de testing
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

    // Inicia la app Nest con adaptador de Fastify
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  // Cerramos las conexiones después de todas las pruebas
  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  describe('Cart List', () => {
    describe('List cart with elements', () => {
      it(' (GET)', async () => {
        // Creamos múltiples productos y carritos con datos falsos
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

        // Creamos los carritos
        const types = await Promise.all(
          createDtos.map((dto) =>
            repositoryManager.create(<CartInterface>dto),
          ),
        );
        const carts = JSON.parse(JSON.stringify(types));

        // Petición GET para listar carritos
        const response = await request(app.getHttpServer())
          .get('/cart')
          .expect(HttpStatus.OK);

        // Verificamos que la cantidad y contenido sea el esperado
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
        // Si no hay carritos, esperamos un array vacío
        const response = await request(app.getHttpServer())
          .get('/cart')
          .expect(HttpStatus.OK);
        expect(response.body.length).toBe(0);
      });
    });

    describe('create cart', () => {
      describe('create cart 201', () => {
        it('/cart (POST)', async () => {
          // Crear un carrito con datos válidos
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

          // Enviamos la solicitud
          const response = await request(app.getHttpServer())
            .post('/cart')
            .send(createDto)
            .expect(HttpStatus.CREATED);

          // Validamos los datos retornados
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
          // Petición sin body, debe fallar
          await request(app.getHttpServer())
            .post('/cart')
            .expect(HttpStatus.BAD_REQUEST);
        });
      });
    });

    describe('Update cart', () => {
      it('/cart/:id (PATCH)', async () => {
        // Crear producto y carrito
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

        // Realizamos el update
        const updateResponse = await request(app.getHttpServer())
          .patch(`/cart/${cartId}`)
          .send(updateDto);

        const updatedCart = await repositoryManager.findByPk(cartId);
        const result = JSON.parse(JSON.stringify(updatedCart));

        // Verificamos que se hayan actualizado los valores
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
        // Intentamos actualizar un carrito inexistente
        const cartId = uuidv4();
        const updateDto = {
          stock: faker.number.int({ min: 1, max: 100 }),
          status: CartStatusEnum.FINISHED,
        };

        const result = await request(app.getHttpServer())
          .patch(`/cart/${cartId}`)
          .send(updateDto);
        expect(result.body).toEqual([null, 0]);
      });
    });

    describe('Delete cart', () => {
      it('/cart/:id (DELETE)', async () => {
        // Crear carrito y eliminarlo permanentemente
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
        const cart = await Cart.create(<CartInterface>createDto);
        const cartId = cart.id;

        const del = await request(app.getHttpServer())
          .delete(`/cart/${cartId}`)
          .send({ force: true })
          .expect(HttpStatus.OK);

        expect(del.body).toBe(1);
        const type = await Cart.findOne({ where: { id: cartId } });
        expect(type).toBeNull();
      });

      it('/cart/:id (DELETE) not delete', async () => {
        // Intentamos eliminar un carrito inexistente
        const cartId = uuidv4();
        await request(app.getHttpServer())
          .delete(`/cart/${cartId}`)
          .send({ force: true })
          .expect(HttpStatus.NOT_FOUND);
      });

      it('/cart/:id (SOFT DELETE)', async () => {
        // Eliminación lógica (soft delete)
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
        const cart = await Cart.create(<CartInterface>createDto);
        const cartId = cart.id;

        const del = await request(app.getHttpServer())
          .delete(`/cart/${cartId}`)
          .send({ force: false })
          .expect(HttpStatus.OK);

        expect(del.body).toBe(1);
        const type = await Cart.findOne({ where: { id: cartId } });
        expect(type).toBeNull(); // Porque soft delete también los oculta
      });

      it('/cart/:id (SOFT DELETE) not softdelete', async () => {
        // Soft delete de carrito inexistente
        const cartId = uuidv4();
        expect(cartId).toBeDefined();
        await request(app.getHttpServer())
          .delete(`/cart/${cartId}`)
          .send({ force: false })
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });
});
