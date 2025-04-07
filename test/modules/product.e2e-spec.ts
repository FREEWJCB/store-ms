import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { Product } from '@/modules/products/schemas/product.schema';
import { faker } from '@test/faker';
import { config } from 'dotenv';
import path from 'path';
import { ProductController } from '@/modules/products/controllers/product.controller';
import { getModelToken } from '@nestjs/sequelize';
import { ProductService } from '@/modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { ProductInterface } from '@/modules/products/schemas/product.schema';
import * as models from '@/modules/_global/config/models';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('Product', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Product;
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
    repositoryManager = sequelize.models['Product'] as typeof Product;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: getModelToken(Product),
          useValue: repositoryManager,
        },
        ProductService,
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
  describe('Product List', () => {

    describe('List product', () => {
      describe('List product with elements', () => {
        it(' (GET)', async () => {
          const numRecords = faker.number.int({ min: 1, max: 10 });
          const createDtos = Array.from({ length: numRecords }, () => ({
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
            stock: faker.number.int({ min: 1, max: 100 }),
            imageURL: faker.helpers.arrayElement(imageUrls),
          }));
          const types = await Promise.all(
            createDtos.map((dto) =>
              repositoryManager.create(<ProductInterface>dto),
            ),
          );
          const products = JSON.parse(JSON.stringify(types));
          const response = await request(app.getHttpServer())
            .get('/product')
            .expect(HttpStatus.OK);
          expect(response.body).toHaveLength(numRecords);
          expect(response.body).toEqual(
            expect.arrayContaining(
              products.map((product: Product) =>
                expect.objectContaining({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  stock: product.stock,
                  imageURL: product.imageURL,
                  createdAt: product.createdAt,
                  updatedAt: product.updatedAt,
                }),
              ),
            ),
          );
        });
      });

      describe('List product empty', () => {
        it(' (GET)', async () => {
          const response = await request(app.getHttpServer())
            .get('/product')
            .expect(HttpStatus.OK);
          expect(response.body.length).toBe(0);
        });
      });
    });
  });
});
