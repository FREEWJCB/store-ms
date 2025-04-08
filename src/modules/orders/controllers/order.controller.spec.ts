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
  // Instancia de Sequelize que se usará para la base de datos en memoria
  let sequelize: Sequelize;

  // Referencia al modelo Order para simular acceso a datos
  let repositoryManager: typeof Order;

  // Instancia del controlador que se va a probar
  let controller: OrderController;

  // Se ejecuta antes de cada prueba
  beforeEach(async () => {
    // Se obtiene una instancia de Sequelize con todos los modelos definidos
    sequelize = getSequelizeInstance(Object.values(models));

    // Se sincronizan los modelos en la base de datos en memoria
    await sequelize.sync();

    // Se obtiene la clase del modelo Order directamente desde Sequelize
    repositoryManager = sequelize.models['Order'] as typeof Order;

    // Se crea el módulo de pruebas con los controladores, proveedores e imports necesarios
    const module: TestingModule = await Test.createTestingModule({
      // Se registra el controlador a probar
      controllers: [OrderController],
      providers: [
        {
          // Se simula la inyección del modelo Order usando su token
          provide: getModelToken(Order),
          useValue: repositoryManager,
        },
        // Se agrega el servicio y el repositorio como proveedores
        OrderService,
        OrderRepository,
      ],
      // Se importa el módulo de prueba de Sequelize con todos los modelos
      imports: [...SequelizeTestingModule(Object.values(models))],
    }).compile();

    // Se obtiene la instancia del controlador desde el módulo compilado
    controller = module.get<OrderController>(OrderController);
  });

  // Se ejecuta después de cada prueba para cerrar la conexión
  afterEach(async () => {
    await sequelize.close();
  });

  // Verifica que el controlador fue correctamente definido
  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });
});
