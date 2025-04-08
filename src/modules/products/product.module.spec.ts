import { Test, TestingModule } from '@nestjs/testing';
import { ProductModule } from '@/modules/products/product.module';
import { ProductController } from '@/modules/products/controllers/product.controller';
import { ProductService } from '@/modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { SequelizeTestingModule } from '@test/root.sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as models from '@/modules/_global/config/models';

describe('ProductModule', () => {
  // Declaración de la variable 'module', que representará el módulo NestJS compilado para pruebas
  let module: TestingModule;

  // Instancia de Sequelize usada para manejar la conexión con la base de datos durante las pruebas
  let sequelize: Sequelize;

  // Hook que se ejecuta antes de correr cualquier prueba dentro del bloque describe
  beforeAll(async () => {
    // Se crea y compila un módulo de prueba que incluye:
    // - SequelizeTestingModule: módulo de configuración para Sequelize en ambiente de pruebas,
    //   recibe todos los modelos necesarios para las pruebas (obtenidos desde el objeto 'models')
    // - ProductModule: el módulo real que se quiere testear
    module = await Test.createTestingModule({
      imports: [
        ...SequelizeTestingModule(Object.values(models)), // Desestructura el array de modelos y los pasa al módulo
        ProductModule,
      ],
    }).compile();

    // Se obtiene la instancia de Sequelize del módulo para poder cerrar la conexión al final de las pruebas
    sequelize = module.get<Sequelize>(Sequelize);
  });

  // Hook que se ejecuta después de que todas las pruebas han terminado
  afterAll(async () => {
    // Cierra la conexión con la base de datos de pruebas para evitar fugas de recursos
    await sequelize.close();
  });

  // Test para verificar que el módulo de prueba fue creado correctamente
  it('should be defined', () => {
    expect(module).toBeDefined(); // Verifica que la variable 'module' no sea undefined
  });

  // Test para comprobar que el controlador de productos está correctamente registrado en el módulo
  it('should have ProductController', () => {
    const controller = module.get<ProductController>(ProductController); // Obtiene el controlador del módulo
    expect(controller).toBeDefined(); // Verifica que el controlador existe
  });

  // Test para comprobar que el servicio de productos está correctamente registrado en el módulo
  it('should have ProductService', () => {
    const service = module.get<ProductService>(ProductService); // Obtiene el servicio del módulo
    expect(service).toBeDefined(); // Verifica que el servicio existe
  });

  // Test para comprobar que el repositorio de productos está correctamente registrado en el módulo
  it('should have ProductRepository', () => {
    const repository = module.get<ProductRepository>(ProductRepository); // Obtiene el repositorio del módulo
    expect(repository).toBeDefined(); // Verifica que el repositorio existe
  });
});
