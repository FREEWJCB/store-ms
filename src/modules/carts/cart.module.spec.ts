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

  // Antes de ejecutar las pruebas, se compila el módulo de pruebas con Sequelize y el módulo CartModule
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...SequelizeTestingModule(Object.values(models)), CartModule],
    }).compile();

    // Se obtiene una instancia de Sequelize para cerrar la conexión más adelante
    sequelize = module.get<Sequelize>(Sequelize);
  });

  // Después de todas las pruebas, se cierra la conexión con Sequelize
  afterAll(async () => {
    await sequelize.close();
  });

  // Verifica que el módulo esté definido correctamente
  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  // Verifica que el controlador de carrito haya sido registrado correctamente en el módulo
  it('should have CartController', () => {
    const controller = module.get<CartController>(CartController);
    expect(controller).toBeDefined();
  });

  // Verifica que el servicio de carrito esté disponible en el módulo
  it('should have CartService', () => {
    const service = module.get<CartService>(CartService);
    expect(service).toBeDefined();
  });

  // Verifica que el repositorio de carrito esté disponible en el módulo
  it('should have CartRepository', () => {
    const repository = module.get<CartRepository>(CartRepository);
    expect(repository).toBeDefined();
  });

  // Verifica que el repositorio de productos esté disponible en el módulo
  it('should have ProductRepository', () => {
    const repository = module.get<ProductRepository>(ProductRepository);
    expect(repository).toBeDefined();
  });
});
