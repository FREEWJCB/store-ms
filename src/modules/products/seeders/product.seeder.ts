import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import { Product, ProductInterface } from '@modules/products/schemas/product.schema';

// Marcamos la clase como un proveedor inyectable
@Injectable()
export class ProductSeeder {
  // Inyectamos el modelo Product directamente desde Sequelize
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  // Método para ejecutar la siembra de datos
  async seed() {
    const products = []; // Arreglo para almacenar productos generados

    // Lista de URLs de imágenes de ejemplo
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

    // Generamos 20 productos de prueba
    for (let i = 0; i < 20; i++) {
      const product = <ProductInterface>{
        name: faker.commerce.productName(), // Nombre aleatorio
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })), // Precio entre 10 y 1000
        stock: faker.number.int({ min: 1, max: 100 }), // Stock entre 1 y 100
        imageURL: faker.helpers.arrayElement(imageUrls), // URL aleatoria
      };
      products.push(product); // Añadimos al array
    }

    // Insertamos todos los productos de una sola vez en la base de datos
    await this.productModel.bulkCreate(products);
  }
}
