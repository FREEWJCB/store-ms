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
  let sequelize: Sequelize;
  let repositoryManager: typeof Product;
  let repository: ProductRepository;
  const imageUrls = [
    'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg',
    'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/71kr3WAj1FL._AC_UL640_QL65_.jpg',
    'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
    'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71g2ednj0JL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/61SBmAP8GvL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71Y5Q7e-6RL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/71kWymZ+c+L._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/51eg55uWmdL._AC_UL640_QL65_ML3_.jpg',
    'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
];

  beforeEach(async () => {
    sequelize = getSequelizeInstance(Object.values(models));
    await sequelize.sync();
    repositoryManager = sequelize.models['Product'] as typeof Product;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: getModelToken(Product),
          useValue: repositoryManager,
        },
        ProductService,
        ProductRepository,
      ],
      imports: [...SequelizeTestingModule(Object.values(models))],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('lists', () => {
    it('should return a list of product', async () => {
      const query = {};
      const result = await repository.lists(query);
      expect(result.length).toBe(0);
    });

    it('should return a list of product', async () => {
      const numRecords = faker.number.int({ min: 1, max: 10 });
      const createDtos = Array.from({ length: numRecords }, () => ({
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        stock: faker.number.int({ min: 1, max: 100 }),
        imageURL: faker.helpers.arrayElement(imageUrls),
      }));
      const types = await Promise.all(
        createDtos.map((dto) => repositoryManager.create(<ProductInterface>dto)),
      );
      const products = JSON.parse(JSON.stringify(types));
      const query = {};
      const result = await repository.lists(query);
      const plainResult = JSON.parse(JSON.stringify(result));
      expect(plainResult).toHaveLength(numRecords);
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
