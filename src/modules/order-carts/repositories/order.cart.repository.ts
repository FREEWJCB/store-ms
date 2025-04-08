import { Inject, Injectable } from '@nestjs/common';
import { OrderCart } from '@/modules/order-carts/schemas/order.cart.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OrderCartRepository {
  constructor(
    @InjectModel(OrderCart)
    private readonly order: typeof OrderCart,
    @Inject(Sequelize) private readonly sequelize: Sequelize,
  ) {}

  public async createBulk(attributes: Partial<OrderCart>[]): Promise<OrderCart[]> {
    const transaction = await this.sequelize.transaction();
    try {
      const results = await this.order.bulkCreate(attributes as OrderCart[], {
        transaction,
      });
      await transaction.commit();
      return results;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}