// Importaciones necesarias para las pruebas en NestJS
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest'; // Cliente HTTP para simular peticiones

// Sequelize y herramientas auxiliares para pruebas con base de datos
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';

// Modelo Order (Pedido)
import { Order } from '@/modules/orders/schemas/order.schema';

// Utilidades de faker para generar datos falsos
import { faker } from '@test/faker';

// Configuración de entorno
import { config } from 'dotenv';
import path from 'path';

// Componentes de Nest para el módulo de órdenes
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { getModelToken } from '@nestjs/sequelize';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';

// Otros modelos relacionados
import * as models from '@/modules/_global/config/models';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { OrderStatusEnum } from '@modules/orders/enums/order.status.enum';

// Repositorios adicionales necesarios para relaciones entre órdenes y carritos
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { OrderCartRepository } from '@/modules/order-carts/repositories/order.cart.repository';
import { Product } from '@/modules/products/schemas/product.schema';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { OrderCart } from '@/modules/order-carts/schemas/order.cart.schema';

describe('Order', () => {
  // Variables para Sequelize y modelos usados directamente
  let sequelize: Sequelize;
  let repositoryManager: typeof Order;
  let repositoryCart: typeof Cart;
  let repositoryProduct: typeof Product;
  let repositoryOrderCart: typeof OrderCart;
  let app: NestFastifyApplication;

  // Cargar las variables de entorno de pruebas
  config({
    path: path.resolve(process.cwd(), '.env.testing'),
  });

  // Preparar la app y la base de datos antes de cada prueba
  beforeEach(async () => {
    // Crear instancia de Sequelize con todos los modelos
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync(); // Sincronizar tablas

    // Acceder directamente a los modelos
    repositoryManager = sequelize.models['Order'] as typeof Order;
    repositoryCart = sequelize.models['Cart'] as typeof Cart;
    repositoryProduct = sequelize.models['Product'] as typeof Product;
    repositoryOrderCart = sequelize.models['OrderCart'] as typeof OrderCart;

    // Crear el módulo de prueba con todos los providers necesarios
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: getModelToken(Order),
          useValue: repositoryManager,
        },
        {
          provide: getModelToken(Cart),
          useValue: repositoryCart,
        },
        {
          provide: getModelToken(Product),
          useValue: repositoryProduct,
        },
        {
          provide: getModelToken(OrderCart),
          useValue: repositoryOrderCart,
        },
        OrderService,
        OrderRepository,
        CartRepository,
        OrderCartRepository,
      ],
      imports: [
        ...SequelizeTestingModule(Object.values(models)),
      ],
    }).compile();

    // Crear la aplicación NestJS con adaptador de Fastify
    app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

    // Agregar validación global (valida DTOs automáticamente)
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    // Inicializar la app
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  // Cerrar la app y base de datos al terminar todas las pruebas
  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  // Pruebas de CRUD para órdenes
  describe('Order CRUD', () => {
    describe('create order', () => {
      // Caso exitoso de creación de una orden
      describe('create order 201', () => {
        it('/order (POST)', async () => {
          // Se genera un objeto DTO con un precio válido
          const createDto = {
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          };

          // Se hace una petición POST al endpoint de orden
          const response = await request(app.getHttpServer())
            .post('/order')
            .send(createDto)
            .expect(HttpStatus.CREATED); // Espera un 201 Created

          // Se valida que la respuesta contenga los datos esperados
          expect(response.body).toMatchObject({
            id: expect.any(String),
            price: createDto.price,
            status: OrderStatusEnum.FINISHED, // Se espera que la orden esté finalizada
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });

      // Caso fallido: no se envía el cuerpo (payload) y se espera un error 400
      describe('create order fail', () => {
        it('/order (POST)', async () => {
          await request(app.getHttpServer())
            .post('/order')
            .expect(HttpStatus.BAD_REQUEST); // Error por falta de datos requeridos
        });
      });
    });
  });
});
