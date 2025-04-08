import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '@modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { Product, ProductInterface } from '@/modules/products/schemas/product.schema';
import { ProductListDto } from '@/modules/products/dtos/product.lists.dto';
import { faker } from '@faker-js/faker';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { ProductController } from '@/modules/products/controllers/product.controller';
import { getModelToken } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';

describe('ProductService', () => {
  // Instancia de Sequelize para pruebas
  let sequelize: Sequelize;

  // Referencia al modelo Product
  let repositoryManager: typeof Product;

  // Servicio que vamos a probar
  let service: ProductService;

  // Arreglo con URLs de imágenes de ejemplo para productos
  const imageUrls = [
    'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
    'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
  ];

  // Antes de cada prueba: configurar módulo de testing
  beforeEach(async () => {
    // Inicializamos Sequelize con todos los modelos globales
    sequelize = getSequelizeInstance(Object.values(models));

    // Sincronizamos las tablas
    await sequelize.sync();

    // Obtenemos el modelo Product desde sequelize
    repositoryManager = sequelize.models['Product'] as typeof Product;

    // Creamos el módulo de prueba
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController], // Incluimos el controlador, aunque no lo probamos directamente aquí
      providers: [
        {
          provide: getModelToken(Product), // Inyectamos el modelo Product manualmente
          useValue: repositoryManager,
        },
        ProductService, // Servicio bajo prueba
        ProductRepository, // Repositorio que el servicio utiliza
      ],
      imports: [
        ...SequelizeTestingModule(Object.values(models)), // Módulo que configura Sequelize en memoria para testing
      ],
    }).compile();

    // Obtenemos la instancia del servicio desde el módulo
    service = module.get<ProductService>(ProductService);
  });

  // Después de todas las pruebas: cerramos la conexión con Sequelize
  afterAll(async () => {
    await sequelize.close();
  });

  // Verificamos que el servicio esté correctamente definido
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Grupo de pruebas para el método lists
  describe('lists', () => {
    // Cuando no hay productos, el resultado debe ser un arreglo vacío
    it('should return empty a list of product', async () => {
      const query: ProductListDto = new ProductListDto(); // DTO vacío
      const result = await service.lists(query); // Ejecutamos el método
      expect(result.length).toBe(0); // Esperamos un arreglo vacío
    });

    // Cuando hay productos creados, debe devolver exactamente los que se insertaron
    it('should return a list of products', async () => {
      // Creamos entre 1 y 10 productos con datos fake
      const numRecords = faker.number.int({ min: 1, max: 10 });

      // Generamos los DTOs
      const createDtos = Array.from({ length: numRecords }, () => ({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        stock: faker.number.int({ min: 1, max: 100 }),
        imageURL: faker.helpers.arrayElement(imageUrls),
      }));

      // Insertamos todos los productos en la base de datos
      const types = await Promise.all(
        createDtos.map((dto) => repositoryManager.create(<ProductInterface>dto)),
      );

      // Convertimos los resultados a objetos planos para facilitar comparación
      const products = JSON.parse(JSON.stringify(types));

      // Ejecutamos el método lists del servicio
      const query: ProductListDto = new ProductListDto();
      const result = await service.lists(query);

      // También convertimos los resultados del servicio a JSON plano
      const plainResult = JSON.parse(JSON.stringify(result));

      // Comprobamos que la cantidad coincida
      expect(plainResult).toHaveLength(numRecords);

      // Verificamos que todos los productos insertados estén presentes en el resultado
      expect(plainResult).toEqual(
        expect.arrayContaining(
          products.map((product: Product) =>
            expect.objectContaining({
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              imageURL: product.imageURL,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            }),
          ),
        ),
      );
    });
  });
});
