import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { CartRepository } from '@modules/carts/repositories/cart.repository';
import { Cart, CartInterface } from '@/modules/carts/schemas/cart.schema';
import {
  SequelizeTestingModule,
  getSequelizeInstance,
} from '@test/root.sequelize';
import { CartService } from '@modules/carts/services/cart.service';
import { CartController } from '@/modules/carts/controllers/cart.controller';
import { getModelToken } from '@nestjs/sequelize';
import { faker } from '@test/faker';
import * as models from '@/modules/_global/config/models';
import {Product, ProductInterface} from '@/modules/products/schemas/product.schema';
import {ProductRepository} from '@/modules/products/repositories/product.repository';
import {CartStatusEnum} from '@modules/carts/enums/cart.status.enum';
import { v4 as uuidv4 } from 'uuid';

describe('CartRepository', () => {
  let sequelize: Sequelize;
  let repositoryManager: typeof Cart;
    let repositoryProduct: typeof Product;
  let repository: CartRepository;
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

    repository = module.get<CartRepository>(CartRepository);
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('lists', () => {
    it('should return a list of cart', async () => {
      const result = await repository.lists();
      expect(result.length).toBe(0);
    });

    it('should return a list of cart', async () => {
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
      const result = await repository.lists();
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
    it('should create a cart not found', async () => {
      const body: Partial<Cart> = {};
      await expect(repository.create(body)).rejects.toThrow();
    });

    it('should create a cart', async () => {
      const productDto: Partial<Product> = {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        stock: faker.number.int({ min: 1, max: 100 }),
        imageURL: faker.helpers.arrayElement(imageUrls),
      };
      const product = await repositoryProduct.create(<ProductInterface>productDto);
      const plainProduct: Product = JSON.parse(JSON.stringify(product));
      const body = {
        stock: faker.number.int({ min: 1, max: plainProduct.stock }),
        productId: plainProduct.id,
      };
      const result = await repository.create(body);
      const plainResult = JSON.parse(JSON.stringify(result));
      expect(plainResult).toMatchObject({
        id: expect.any(String),
        stock: body.stock,
        status: CartStatusEnum.PENDING,
        productId: body.productId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('update', () => {
    it('should update a cart by id', async () => {
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
      const createdCart = await repositoryManager.create(
        <CartInterface>body,
      );
      const updateBody: Partial<Cart> = {
        stock: faker.number.int({ min: 1, max: plainProduct.stock }),
        status: CartStatusEnum.FINISHED,
      };
      const result = await repository.update(
        { id: createdCart.id },
        updateBody,
      );
      const plainResult = JSON.parse(JSON.stringify(result));
      const updatedCart = await repositoryManager.findByPk(
        createdCart.id,
      );
      const cart = JSON.parse(JSON.stringify(updatedCart));
      expect(cart).toMatchObject({
        id: createdCart.id,
        stock: updateBody.stock,
        status: updateBody.status,
        productId: body.productId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(plainResult).toEqual([null, 1]);
    });

    it('should update a cart by id fail', async () => {
      const cartId = uuidv4();
      const body: Partial<Cart> = {
        stock: faker.number.int({ min: 1, max: 100 }),
        status: CartStatusEnum.FINISHED,
      };
      const result = await repository.update({ id: cartId }, body);
      const plainResult = JSON.parse(JSON.stringify(result));
      expect(plainResult).toEqual([expect.arrayContaining([]), 0]);
    });
  });

  describe('delete', () => {
    it('should delete a cart by id', async () => {
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
      const createdCart = await repository.create(body);
      const result = await repository.delete({
        where: { id: createdCart.id },
        force: true,
      });
      const read = await repositoryManager.findByPk(createdCart.id);
      expect(read).toBeNull();
      expect(result).toBe(1);
    });

    it('should not delete a cart by id', async () => {
      const id = uuidv4();
      await expect(
        repository.delete({
          where: { id },
          force: true,
        }),
      ).rejects.toThrow('Model Not Found Exception');
    });

    it('should softdelete a cart by id', async () => {
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
      const createdCart = await repository.create(body);
      const result = await repository.delete({
        where: { id: createdCart.id },
      });
      const read = await repositoryManager.findByPk(createdCart.id);
      expect(result).toBe(1);
      expect(read).toBeNull();
    });

    it('should not softdelete a cart by id', async () => {
      const id = uuidv4();
      await expect(
        repository.delete({
          where: { id },
        }),
      ).rejects.toThrow('Model Not Found Exception');
    });
  });
});
