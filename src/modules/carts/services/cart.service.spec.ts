import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '@modules/carts/services/cart.service';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { Cart, CartInterface } from '@/modules/carts/schemas/cart.schema';
import { faker } from '@faker-js/faker';
import { Sequelize } from 'sequelize-typescript';
import {
  getSequelizeInstance,
  SequelizeTestingModule,
} from '@test/root.sequelize';
import { CartController } from '@/modules/carts/controllers/cart.controller';
import { getModelToken } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';
import {Product, ProductInterface} from '@/modules/products/schemas/product.schema';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import {CartStatusEnum} from '@modules/carts/enums/cart.status.enum';

describe('CartService', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Cart;
  let repositoryProduct: typeof Product;
  let service: CartService;
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
    repositoryManager = sequelize.models['Cart'] as typeof Cart;
    repositoryProduct = sequelize.models['Product'] as typeof Product;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: getModelToken(Cart),
          useValue: repositoryManager,
        },
        {
          provide: getModelToken(Product),
          useValue: repositoryProduct,
        },
        CartService,
        CartRepository,
        ProductRepository,
      ],
      imports: [...SequelizeTestingModule(Object.values(models))],
    }).compile();
    service = module.get<CartService>(CartService);
  });
  afterAll(async () => {
    await sequelize.close();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('lists', () => {
    it('should return empty a list of cart', async () => {
      const result = await service.lists();
      expect(result.length).toBe(0);
    });

    it('should return empty a list of cart', async () => {
      const numRecords = faker.number.int({ min: 1, max: 10 });
      const createDtos = await Promise.all(
        Array.from({ length: numRecords }, async () => {
          const productDto: Partial<Product> = {
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
            stock: faker.number.int({ min: 1, max: 100 }),
            imageURL: faker.helpers.arrayElement(imageUrls),
          };
          const product = await repositoryProduct.create(<ProductInterface>productDto);
          const plainProduct: Product = JSON.parse(JSON.stringify(product));

          return {
            stock: faker.number.int({ min: 1, max: plainProduct.stock }),
            productId: plainProduct.id,
          };
        })
      );
      const types = await Promise.all(
        createDtos.map((dto) => repositoryManager.create(<CartInterface>dto)),
      );
      const carts = JSON.parse(JSON.stringify(types));
      const result = await service.lists();
      const plainResult = JSON.parse(JSON.stringify(result));
      expect(plainResult).toHaveLength(numRecords);
      expect(plainResult).toEqual(
        expect.arrayContaining(
          carts.map((cart: Cart) =>
            expect.objectContaining({
              id: cart.id,
              stock: cart.stock,
              status: cart.status,
              productId: cart.productId,
              createdAt: cart.createdAt,
              updatedAt: cart.updatedAt,
            }),
          ),
        ),
      );
    });
  });

  describe('create', () => {
    it('should create a cart', async () => {
      const productDto: Partial<Product> = {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        stock: faker.number.int({ min: 1, max: 100 }),
        imageURL: faker.helpers.arrayElement(imageUrls),
      };
      const product = await repositoryProduct.create(<ProductInterface>productDto);
      const plainProduct: Product = JSON.parse(JSON.stringify(product));
      const body: Partial<Cart> = {
        stock: faker.number.int({ min: 1, max: plainProduct.stock }),
        productId: plainProduct.id,
      };
      const result = await service.create(body);
      const cart = JSON.parse(JSON.stringify(result));
      expect(cart).toMatchObject({
        id: expect.any(String),
        stock: body.stock,
        status: CartStatusEnum.PENDING,
        productId: body.productId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should create a cart not found', async () => {
      const body: Partial<Cart> = {};
      await expect(service.create(body)).rejects.toThrow();
    });
  });
});
