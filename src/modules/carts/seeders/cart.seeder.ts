import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { faker } from '@faker-js/faker';
import { Cart, CartInterface } from '@modules/carts/schemas/cart.schema';
import { Product } from '@/modules/products/schemas/product.schema';

@Injectable()
export class CartSeeder {
  constructor(
    @InjectModel(Cart)
    private cartModel: typeof Cart,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async seed() {
    const carts = [];
    const products = await this.productModel.findAll(); // Obtiene todos los productos
    const availableProducts = [...products]; // Copia la lista de productos para manipularla

    for (let i = 0; i < 7 && availableProducts.length > 0; i++) {
      // Selecciona un producto aleatorio de la lista de productos disponibles
      const randomIndex = faker.number.int({ min: 0, max: availableProducts.length - 1 });
      const selectedProduct = availableProducts.splice(randomIndex, 1)[0]; // Elimina el producto seleccionado de la lista

      const cart = <CartInterface>{
        stock: faker.number.int({ min: 1, max: selectedProduct!.stock }), // Usa el stock del producto seleccionado
        productId: selectedProduct!.id, // Asocia el carrito al producto seleccionado
      };
      carts.push(cart);
    }

    await this.cartModel.bulkCreate(carts); // Inserta los carritos en la base de datos
  }
}