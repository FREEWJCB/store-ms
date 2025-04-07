import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { Order } from '@/modules/orders/schemas/order.schema';
import { OrderService } from '@modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import * as models from '@/modules/_global/config/models';

describe('OrderController', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Order;
  let controller: OrderController;

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

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });
});
