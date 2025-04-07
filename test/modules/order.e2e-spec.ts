import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { Order } from '@/modules/orders/schemas/order.schema';
import { faker } from '@test/faker';
import { config } from 'dotenv';
import path from 'path';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { getModelToken } from '@nestjs/sequelize';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import * as models from '@/modules/_global/config/models';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { OrderStatusEnum } from '@modules/orders/enums/order.status.enum';

describe('Order', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Order;
  let app: NestFastifyApplication;
  config({
    path: path.resolve(process.cwd(), '.env.testing'),
  });
  beforeEach(async () => {
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync();
    repositoryManager = sequelize.models['Order'] as typeof Order;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: getModelToken(Order),
          useValue: repositoryManager,
        },
        OrderService,
        OrderRepository,
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
  describe('Order CRUD', () => {

    describe('create order', () => {
      describe('create order 201', () => {
        it('/order (POST)', async () => {
          const createDto = {
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          };
          const response = await request(app.getHttpServer())
            .post('/order')
            .send(createDto)
            .expect(HttpStatus.CREATED);

          expect(response.body).toMatchObject({
            id: expect.any(String),
            price: createDto.price,
            status: OrderStatusEnum.FINISHED,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });
      describe('create order fail', () => {
        it('/order (POST)', async () => {
          await request(app.getHttpServer())
            .post('/order')
            .expect(HttpStatus.BAD_REQUEST);
        });
      });
    });
  });
});
