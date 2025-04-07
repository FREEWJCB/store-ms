import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import { Product, ProductInterface } from '@modules/products/schemas/product.schema';

@Injectable()
export class ProductSeeder {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async seed() {
    const products = [];

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

    for (let i = 0; i < 20; i++) {
      const product = <ProductInterface>{
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        stock: faker.number.int({ min: 1, max: 100 }),
        imageURL: faker.helpers.arrayElement(imageUrls),
      };
      products.push(product);
    }

    await this.productModel.bulkCreate(products);
  }
}
