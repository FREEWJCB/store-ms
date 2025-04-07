import { Inject, Injectable } from '@nestjs/common';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart)
    private readonly cart: typeof Cart,
    @Inject(Sequelize) private readonly sequelize: Sequelize,
  ) {}

  public async create(attribute: Partial<Cart>): Promise<Cart> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.cart.create(attribute as Cart, {
        transaction,
      });
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
