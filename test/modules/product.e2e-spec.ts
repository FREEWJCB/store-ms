// Importa herramientas necesarias para pruebas en NestJS
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; // Cliente HTTP para realizar peticiones en pruebas E2E

// Sequelize y utilidades para test con base de datos
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';

// Modelo del producto y utilidades de faker para datos aleatorios
import { Product } from '@/modules/products/schemas/product.schema';
import { faker } from '@test/faker';

// Configuración de variables de entorno para entorno de pruebas
import { config } from 'dotenv';
import path from 'path';

// Módulos y servicios del producto
import { ProductController } from '@/modules/products/controllers/product.controller';
import { getModelToken } from '@nestjs/sequelize';
import { ProductService } from '@/modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { ProductInterface } from '@/modules/products/schemas/product.schema';
import * as models from '@/modules/_global/config/models';

// Adaptador para usar Fastify en lugar de Express
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('Product', () => {
  let sequelize: Sequelize; // Instancia de Sequelize para pruebas
  let repositoryManager: typeof Product; // Acceso directo al modelo Product
  let app: NestFastifyApplication; // Instancia de la app Nest con Fastify

  // Lista de imágenes falsas para productos
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

  // Carga variables de entorno desde archivo `.env.testing`
  config({
    path: path.resolve(process.cwd(), '.env.testing'),
  });

  // Antes de cada prueba: inicializar la app, base de datos y módulos necesarios
  beforeEach(async () => {
    // Crea una instancia de Sequelize con los modelos necesarios
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync(); // Sincroniza los modelos con la base de datos en memoria

    // Obtiene el modelo Product para hacer inserciones directas durante las pruebas
    repositoryManager = sequelize.models['Product'] as typeof Product;

    // Crea el módulo de prueba
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: getModelToken(Product),
          useValue: repositoryManager, // Se inyecta el modelo real
        },
        ProductService,
        ProductRepository,
      ],
      imports: [
        ...SequelizeTestingModule(Object.values(models)), // Módulo Sequelize con los modelos
      ],
    }).compile();

    // Se crea la aplicación Nest con Fastify
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    // Se agrega un pipe global de validación para transformar y validar DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init(); // Inicializa la app
    await app.getHttpAdapter().getInstance().ready(); // Espera que Fastify esté listo
  });

  // Después de todas las pruebas, cierra la conexión a la BD y la app
  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  // Sección principal de pruebas de listado de productos
  describe('Product List', () => {

    describe('List product', () => {

      // Prueba para verificar que se listan los productos creados
      describe('List product with elements', () => {
        it(' (GET)', async () => {
          // Se generan entre 1 y 10 productos de prueba usando faker
          const numRecords = faker.number.int({ min: 1, max: 10 });
          const createDtos = Array.from({ length: numRecords }, () => ({
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
            stock: faker.number.int({ min: 1, max: 100 }),
            imageURL: faker.helpers.arrayElement(imageUrls),
          }));

          // Se insertan los productos directamente en la base de datos
          const types = await Promise.all(
            createDtos.map((dto) =>
              repositoryManager.create(<ProductInterface>dto),
            ),
          );

          // Se convierte a JSON plano para poder comparar con la respuesta
          const products = JSON.parse(JSON.stringify(types));

          // Se hace una petición GET a /product
          const response = await request(app.getHttpServer())
            .get('/product')
            .expect(HttpStatus.OK);

          // Se espera que el número de productos sea igual al creado
          expect(response.body).toHaveLength(numRecords);

          // Se espera que la respuesta contenga todos los productos insertados
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

      // Prueba para verificar que cuando no hay productos, se responde con lista vacía
      describe('List product empty', () => {
        it(' (GET)', async () => {
          // No se insertan productos
          const response = await request(app.getHttpServer())
            .get('/product')
            .expect(HttpStatus.OK);

          // Se espera que la lista esté vacía
          expect(response.body.length).toBe(0);
        });
      });
    });
  });
});
