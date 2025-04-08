import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { OrderRepository } from '@modules/orders/repositories/order.repository';
import { Order } from '@/modules/orders/schemas/order.schema';
import {
  SequelizeTestingModule,
  getSequelizeInstance,
} from '@test/root.sequelize';
import { OrderService } from '@modules/orders/services/order.service';
import { OrderController } from '@modules/orders/controllers/order.controller';
import { getModelToken } from '@nestjs/sequelize';
import { faker } from '@test/faker';
import * as models from '@/modules/_global/config/models';
import { OrderStatusEnum } from '@modules/orders/enums/order.status.enum';

describe('OrderRepository', () => {
  let sequelize: Sequelize; // Instancia de Sequelize usada para las pruebas
  let repositoryManager: typeof Order; // Referencia al modelo de Order
  let repository: OrderRepository; // Repositorio que se va a probar

  beforeEach(async () => {
    // Inicializa una instancia de Sequelize con los modelos proporcionados
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync(); // Sincroniza la base de datos de prueba

    // Obtiene el modelo Order desde Sequelize
    repositoryManager = sequelize.models['Order'] as typeof Order;

    // Crea el módulo de prueba e inyecta dependencias necesarias
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController], // Controlador incluido (aunque no se prueba directamente aquí)
      providers: [
        {
          // Inyecta el modelo Order en NestJS usando el token correspondiente
          provide: getModelToken(Order),
          useValue: repositoryManager,
        },
        OrderService, // Servicio que depende del repositorio
        OrderRepository, // El repositorio que será probado
      ],
      imports: [...SequelizeTestingModule(Object.values(models))], // Módulo para pruebas con Sequelize
    }).compile();

    // Obtiene una instancia del repositorio desde el módulo de pruebas
    repository = module.get<OrderRepository>(OrderRepository);
  });

  afterAll(async () => {
    // Cierra la conexión a Sequelize después de todas las pruebas
    await sequelize.close();
  });

  it('should be defined', () => {
    // Verifica que el repositorio esté correctamente definido
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a order not found', async () => {
      // Intenta crear una orden sin atributos, lo cual debe lanzar un error
      const body: Partial<Order> = {};
      await expect(repository.create(body)).rejects.toThrow();
    });

    it('should create a order', async () => {
      // Crea una orden válida con un precio generado aleatoriamente
      const body = {
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      };

      // Llama al método create del repositorio
      const result = await repository.create(body);

      // Convierte el resultado a JSON plano
      const plainResult = JSON.parse(JSON.stringify(result));

      // Verifica que el objeto creado tenga la estructura esperada
      expect(plainResult).toMatchObject({
        id: expect.any(String),
        price: body.price,
        status: OrderStatusEnum.FINISHED, // El estado predeterminado esperado
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
