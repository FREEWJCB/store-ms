import { Inject, Injectable } from '@nestjs/common';
import { Order } from '@/modules/orders/schemas/order.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order)
    private readonly order: typeof Order,
    @Inject(Sequelize) private readonly sequelize: Sequelize,
  ) {}

  public async create(attribute: Partial<Order>): Promise<Order> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await this.order.create(attribute as Order, {
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
