import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { Product } from '@/modules/products/schemas/product.schema';
import { ProductService } from '@modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { ProductController } from '@/modules/products/controllers/product.controller';
import * as models from '@/modules/_global/config/models';

describe('ProductController', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Product;
  let controller: ProductController;

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
      imports: [...SequelizeTestingModule(Object.values(models))],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });
});
