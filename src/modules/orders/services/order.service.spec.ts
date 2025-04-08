import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '@modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { Order } from '@/modules/orders/schemas/order.schema';
import { faker } from '@faker-js/faker';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { getModelToken } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';
import { OrderStatusEnum } from '@modules/orders/enums/order.status.enum';

// Grupo de pruebas para OrderService
describe('OrderService', () => {
  let sequelize: Sequelize; // Instancia de Sequelize para pruebas
  let repositoryManager: typeof Order; // Modelo de orden en Sequelize
  let service: OrderService; // Instancia del servicio a probar

  // Antes de cada prueba, se inicializa el módulo de pruebas con todos los modelos necesarios
  beforeEach(async () => {
    // Se crea la instancia de Sequelize y se sincroniza con la base en memoria
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync();

    // Se obtiene el modelo Order del Sequelize inicializado
    repositoryManager = sequelize.models['Order'] as typeof Order;

    // Se crea el módulo de pruebas incluyendo controller, service, repository y el modelo inyectado
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: getModelToken(Order), // Se inyecta manualmente el modelo usando el token de NestJS
          useValue: repositoryManager,
        },
        OrderService,
        OrderRepository,
      ],
      imports: [...SequelizeTestingModule(Object.values(models))],
    }).compile();

    // Se obtiene la instancia del servicio desde el módulo
    service = module.get<OrderService>(OrderService);
  });

  // Después de todas las pruebas, se cierra la conexión de Sequelize
  afterAll(async () => {
    await sequelize.close();
  });

  // Prueba básica: verificar que el servicio está correctamente definido
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Grupo de pruebas para el método "create" del servicio
  describe('create', () => {
    // Caso exitoso: se crea una orden con precio aleatorio usando faker
    it('should create a order', async () => {
      const body: Partial<Order> = {
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      };

      // Se llama al método create del servicio
      const result = await service.create(body);

      // Se convierte el resultado a objeto plano para comparar
      const order = JSON.parse(JSON.stringify(result));

      // Se espera que tenga los campos esperados
      expect(order).toMatchObject({
        id: expect.any(String),
        price: body.price,
        status: OrderStatusEnum.FINISHED,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    // Caso de error: se intenta crear una orden vacía (sin datos), lo que debe lanzar un error
    it('should create a order not found', async () => {
      const body: Partial<Order> = {};
      await expect(service.create(body)).rejects.toThrow();
    });
  });
});
