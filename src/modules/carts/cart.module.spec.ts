import { Test, TestingModule } from '@nestjs/testing';
import { CartModule } from '@/modules/carts/cart.module';
import { CartController } from '@/modules/carts/controllers/cart.controller';
import { CartService } from '@/modules/carts/services/cart.service';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { SequelizeTestingModule } from '@test/root.sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as models from '@/modules/_global/config/models';
import { ProductRepository } from '@modules/products/repositories/product.repository';

describe('CartModule', () => {
  let module: TestingModule;
  let sequelize: Sequelize;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...SequelizeTestingModule(Object.values(models)), CartModule],
    }).compile();
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have CartController', () => {
    const controller = module.get<CartController>(CartController);
    expect(controller).toBeDefined();
  });

  it('should have CartService', () => {
    const service = module.get<CartService>(CartService);
    expect(service).toBeDefined();
  });

  it('should have CartRepository', () => {
    const repository = module.get<CartRepository>(CartRepository);
    expect(repository).toBeDefined();
  });

  it('should have ProductRepository', () => {
    const repository = module.get<ProductRepository>(ProductRepository);
    expect(repository).toBeDefined();
  });
});
