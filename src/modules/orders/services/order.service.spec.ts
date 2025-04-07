import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '@modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { Order } from '@/modules/orders/schemas/order.schema';
import { faker } from '@faker-js/faker';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { getModelToken } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';
import {OrderStatusEnum} from '@modules/orders/enums/order.status.enum';

describe('OrderService', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Order;
  let service: OrderService;
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
      imports: [...SequelizeTestingModule(Object.values(models))],
    }).compile();
    service = module.get<OrderService>(OrderService);
  });
  afterAll(async () => {
    await sequelize.close();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a order', async () => {
      const body: Partial<Order> = {
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      };
      const result = await service.create(body);
      const order = JSON.parse(JSON.stringify(result));
      expect(order).toMatchObject({
        id: expect.any(String),
        price: body.price,
        status: OrderStatusEnum.FINISHED,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should create a order not found', async () => {
      const body: Partial<Order> = {};
      await expect(service.create(body)).rejects.toThrow();
    });
  });
});
