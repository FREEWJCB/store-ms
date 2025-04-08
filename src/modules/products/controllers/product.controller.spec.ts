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

  // Antes de cada prueba, se inicializa Sequelize y se compila el módulo de pruebas
  beforeEach(async () => {
    // Se crea una instancia de Sequelize con los modelos proporcionados
    sequelize = getSequelizeInstance(Object.values(models));
    // Se sincroniza la base de datos
    await sequelize.sync();
    // Se obtiene la clase del modelo Product desde Sequelize
    repositoryManager = sequelize.models['Product'] as typeof Product;

    // Se configura el módulo de pruebas con el controlador y los proveedores necesarios
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: getModelToken(Product), // Se inyecta el modelo Product
          useValue: repositoryManager,
        },
        ProductService, // Servicio del producto
        ProductRepository, // Repositorio del producto
      ],
      imports: [...SequelizeTestingModule(Object.values(models))], // Se importan los módulos de prueba con Sequelize
    }).compile();

    // Se obtiene una instancia del controlador desde el módulo
    controller = module.get<ProductController>(ProductController);
  });

  // Después de cada prueba, se cierra la conexión con la base de datos
  afterEach(async () => {
    await sequelize.close();
  });

  // Prueba para verificar que el controlador esté definido
  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });
});
