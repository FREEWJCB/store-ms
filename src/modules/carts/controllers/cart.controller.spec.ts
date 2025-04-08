import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { CartService } from '@modules/carts/services/cart.service';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { CartController } from '@/modules/carts/controllers/cart.controller';
import * as models from '@/modules/_global/config/models';
import { Product } from '@/modules/products/schemas/product.schema';
import { ProductRepository } from '@/modules/products/repositories/product.repository';

describe('CartController', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Cart;
  let repositoryProduct: typeof Product;
  let controller: CartController;

  beforeEach(async () => {
    // Se crea una instancia de Sequelize en memoria para pruebas
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync(); // Se sincronizan los modelos en la base en memoria

    // Se obtienen referencias a los modelos Cart y Product desde sequelize
    repositoryManager = sequelize.models['Cart'] as typeof Cart;
    repositoryProduct = sequelize.models['Product'] as typeof Product;

    // Se crea el módulo de prueba con las dependencias necesarias
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: getModelToken(Cart), // Se inyecta el modelo Cart mockeado
          useValue: repositoryManager,
        },
        {
          provide: getModelToken(Product), // Se inyecta el modelo Product mockeado
          useValue: repositoryProduct,
        },
        CartService,
        CartRepository,
        ProductRepository,
      ],
      imports: [...SequelizeTestingModule(Object.values(models))], // Se importa el módulo de Sequelize para pruebas
    }).compile();

    controller = module.get<CartController>(CartController); // Se obtiene la instancia del controller
  });

  afterEach(async () => {
    // Se cierra la conexión de Sequelize después de cada prueba
    await sequelize.close();
  });

  it('Should be defined', () => {
    // Verifica que el controlador fue correctamente instanciado
    expect(controller).toBeDefined();
  });
});
