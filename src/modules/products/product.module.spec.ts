import { Test, TestingModule } from '@nestjs/testing';
import { ProductModule } from '@/modules/products/product.module';
import { ProductController } from '@/modules/products/controllers/product.controller';
import { ProductService } from '@/modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { SequelizeTestingModule } from '@test/root.sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as models from '@/modules/_global/config/models';

describe('ProductModule', () => {
  let module: TestingModule;
  let sequelize: Sequelize;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...SequelizeTestingModule(Object.values(models)), ProductModule],
    }).compile();
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ProductController', () => {
    const controller = module.get<ProductController>(ProductController);
    expect(controller).toBeDefined();
  });

  it('should have ProductService', () => {
    const service = module.get<ProductService>(ProductService);
    expect(service).toBeDefined();
  });

  it('should have ProductRepository', () => {
    const repository = module.get<ProductRepository>(ProductRepository);
    expect(repository).toBeDefined();
  });
});
