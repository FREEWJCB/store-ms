import { Test, TestingModule } from '@nestjs/testing';
import { OrderModule } from '@/modules/orders/order.module';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { SequelizeTestingModule } from '@test/root.sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as models from '@/modules/_global/config/models';

describe('OrderModule', () => {
  let module: TestingModule;
  let sequelize: Sequelize;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...SequelizeTestingModule(Object.values(models)), OrderModule],
    }).compile();
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have OrderController', () => {
    const controller = module.get<OrderController>(OrderController);
    expect(controller).toBeDefined();
  });

  it('should have OrderService', () => {
    const service = module.get<OrderService>(OrderService);
    expect(service).toBeDefined();
  });

  it('should have OrderRepository', () => {
    const repository = module.get<OrderRepository>(OrderRepository);
    expect(repository).toBeDefined();
  });
});
