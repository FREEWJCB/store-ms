import { Inject, Injectable } from '@nestjs/common';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { InjectModel } from '@nestjs/sequelize';
import { DestroyOptions, WhereOptions } from 'sequelize';
import { CartStatusEnum } from '@modules/carts/enums/cart.status.enum';
import { ModelNotFoundException } from '@/modules/_global/exceptions/model.not.found.exception';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '@/modules/products/schemas/product.schema';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart)
    private readonly cart: typeof Cart,
    @Inject(Sequelize)
    private readonly sequelize: Sequelize,
  ) {}

  public async lists(): Promise<Cart[]> {
    return this.cart.findAll({
      where: <WhereOptions<Cart>>{
        status: CartStatusEnum.PENDING, // Filtramos los carritos con estado PENDING
      },
      include: [
        {
          model: Product,
          as: 'product',
          required: false, // Incluimos los productos relacionados (si existen)
        },
      ],
      order: [['createdAt', 'DESC']], // Ordenamos por fecha de creación descendente
    });
  }

  public async create(attribute: Partial<Cart>): Promise<Cart> {
    const transaction = await this.sequelize.transaction(); // Iniciamos una transacción
    try {
      const result = await this.cart.create(attribute as Cart, {
        transaction, // Asociamos la transacción al create
      });
      await transaction.commit(); // Confirmamos la transacción si todo va bien
      return result;
    } catch (error) {
      await transaction.rollback(); // Revertimos cambios en caso de error
      throw error;
    }
  }

  public async update(
    query: WhereOptions<Cart>,
    body: Partial<Cart>,
  ): Promise<[affectedCount: number, affectedRows: Cart[]]> {
    try {
      const result = await this.cart.update(body, {
        where: query, // Aplicamos el filtro recibido
        returning: true, // Retornamos los registros modificados
      });
      const [affectedCount] = result;
      if (affectedCount === 0) {
        // Lanzamos excepción si no se encontró ningún carrito
        throw new ModelNotFoundException('Cart', JSON.stringify(query));
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async delete(criteria: DestroyOptions<Cart>): Promise<number> {
    try {
      const destroy = await this.cart.destroy(criteria); // Ejecutamos la eliminación
      if (destroy === 0) {
        // Si no se eliminó ningún registro, lanzamos excepción
        throw new ModelNotFoundException(
          'Cart',
          JSON.stringify(criteria),
        );
      }
      return destroy;
    } catch (error) {
      throw error;
    }
  }
}
