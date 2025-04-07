import { Inject, Injectable } from '@nestjs/common';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { InjectModel } from '@nestjs/sequelize';
import { DestroyOptions, WhereOptions } from 'sequelize';
import { CartStatusEnum } from '@modules/carts/enums/cart.status.enum';
import { ModelNotFoundException } from '@/modules/_global/exceptions/model.not.found.exception';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart)
    private readonly cart: typeof Cart,
    @Inject(Sequelize) private readonly sequelize: Sequelize,
  ) {}

  public async lists(): Promise<Cart[]> {
    return this.cart.findAll({
      where: <WhereOptions<Cart>>{
        status: CartStatusEnum.PENDING,
      },
    });
  }

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

  public async update(
    query: WhereOptions<Cart>,
    body: Partial<Cart>,
  ): Promise<[affectedCount: number, affectedRows: Cart[]]> {
    try {
      const result = await this.cart.update(body, {
        where: query,
        returning: true,
      });
      const [affectedCount] = result;
      if (affectedCount === 0) {
        throw new ModelNotFoundException('Cart', JSON.stringify(query));
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async delete(criteria: DestroyOptions<Cart>): Promise<number> {
    try {
      const destroy = await this.cart.destroy(criteria);
      if (destroy === 0) {
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
