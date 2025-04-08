import { Test, TestingModule } from '@nestjs/testing';
import { OrderModule } from '@/modules/orders/order.module';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { SequelizeTestingModule } from '@test/root.sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as models from '@/modules/_global/config/models';

describe('OrderModule', () => {
  // Variable que almacenará el módulo de prueba compilado
  let module: TestingModule;

  // Instancia de Sequelize para la base de datos de prueba
  let sequelize: Sequelize;

  // Hook que se ejecuta antes de todas las pruebas
  beforeAll(async () => {
    // Se crea el módulo de prueba con Sequelize y el módulo de órdenes
    module = await Test.createTestingModule({
      // Se importan los modelos y el módulo de órdenes
      imports: [...SequelizeTestingModule(Object.values(models)), OrderModule],
    }).compile();

    // Se obtiene la instancia de Sequelize del módulo
    sequelize = module.get<Sequelize>(Sequelize);
  });

  // Hook que se ejecuta después de todas las pruebas
  afterAll(async () => {
    // Cierra la conexión con la base de datos
    await sequelize.close();
  });

  // Prueba que valida que el módulo esté correctamente definido
  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  // Prueba que valida que el controlador de órdenes esté registrado en el módulo
  it('should have OrderController', () => {
    const controller = module.get<OrderController>(OrderController);
    expect(controller).toBeDefined();
  });

  // Prueba que valida que el servicio de órdenes esté registrado en el módulo
  it('should have OrderService', () => {
    const service = module.get<OrderService>(OrderService);
    expect(service).toBeDefined();
  });

  // Prueba que valida que el repositorio de órdenes esté registrado en el módulo
  it('should have OrderRepository', () => {
    const repository = module.get<OrderRepository>(OrderRepository);
    expect(repository).toBeDefined();
  });
});
