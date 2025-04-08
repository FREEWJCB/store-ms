import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { ProductRepository } from './product.repository';
import { Product, ProductInterface } from '@/modules/products/schemas/product.schema';
import {
  SequelizeTestingModule,
  getSequelizeInstance,
} from '@test/root.sequelize';
import { ProductService } from '@modules/products/services/product.service';
import { ProductController } from '@/modules/products/controllers/product.controller';
import { getModelToken } from '@nestjs/sequelize';
import { faker } from '@test/faker';
import * as models from '@/modules/_global/config/models';

describe('ProductRepository', () => {
  let sequelize: Sequelize; // Instancia de Sequelize para pruebas
  let repositoryManager: typeof Product; // Referencia directa al modelo Product
  let repository: ProductRepository; // Repositorio que se va a probar

  // Lista de URLs falsas para imágenes de productos
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

  beforeEach(async () => {
    // Crea instancia de Sequelize y sincroniza modelos
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync();

    // Obtiene el modelo Product desde Sequelize
    repositoryManager = sequelize.models['Product'] as typeof Product;

    // Crea el módulo de pruebas con controlador, servicio y repositorio
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          // Mockea el modelo Product con Sequelize
          provide: getModelToken(Product),
          useValue: repositoryManager,
        },
        ProductService,
        ProductRepository,
      ],
      imports: [...SequelizeTestingModule(Object.values(models))], // Importa entorno de prueba
    }).compile();

    // Obtiene el repositorio del módulo
    repository = module.get<ProductRepository>(ProductRepository);
  });

  afterAll(async () => {
    // Cierra conexión de Sequelize al finalizar las pruebas
    await sequelize.close();
  });

  it('should be defined', () => {
    // Verifica que el repositorio esté definido
    expect(repository).toBeDefined();
  });

  describe('lists', () => {
    it('should return a list of product', async () => {
      // Prueba cuando no hay productos
      const query = {}; // Filtro vacío
      const result = await repository.lists(query); // Llama método lists del repositorio
      expect(result.length).toBe(0); // Se espera que no retorne productos
    });

    it('should return a list of product', async () => {
      // Número aleatorio de productos a crear
      const numRecords = faker.number.int({ min: 1, max: 10 });

      // Crea un array de productos con datos falsos
      const createDtos = Array.from({ length: numRecords }, () => ({
        name: faker.commerce.productName(), // Nombre aleatorio
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })), // Precio aleatorio
        stock: faker.number.int({ min: 1, max: 100 }), // Stock aleatorio
        imageURL: faker.helpers.arrayElement(imageUrls), // Imagen aleatoria
      }));

      // Inserta productos en la base de datos
      const types = await Promise.all(
        createDtos.map((dto) => repositoryManager.create(<ProductInterface>dto)),
      );

      // Convierte a objetos planos (sin instancias Sequelize)
      const products = JSON.parse(JSON.stringify(types));

      const query = {}; // Sin filtros
      const result = await repository.lists(query); // Obtiene la lista desde el repositorio

      // Convierte resultado a objeto plano para facilitar comparación
      const plainResult = JSON.parse(JSON.stringify(result));

      // Verifica que se obtenga la misma cantidad de productos creados
      expect(plainResult).toHaveLength(numRecords);

      // Verifica que los productos obtenidos contengan la misma información
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
