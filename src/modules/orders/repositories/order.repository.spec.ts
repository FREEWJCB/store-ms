import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { OrderRepository } from '@modules/orders/repositories/order.repository';
import { Order } from '@/modules/orders/schemas/order.schema';
import {
  SequelizeTestingModule,
  getSequelizeInstance,
} from '@test/root.sequelize';
import { OrderService } from '@modules/orders/services/order.service';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { getModelToken } from '@nestjs/sequelize';
import { faker } from '@test/faker';
import * as models from '@/modules/_global/config/models';
import {OrderStatusEnum} from '@modules/orders/enums/order.status.enum';

describe('OrderRepository', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Order;
  let repository: OrderRepository;

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

    repository = module.get<OrderRepository>(OrderRepository);
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a order not found', async () => {
      const body: Partial<Order> = {};
      await expect(repository.create(body)).rejects.toThrow();
    });

    it('should create a order', async () => {
      const body = {
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      };
      const result = await repository.create(body);
      const plainResult = JSON.parse(JSON.stringify(result));
      expect(plainResult).toMatchObject({
        id: expect.any(String),
        price: body.price,
        status: OrderStatusEnum.FINISHED,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
