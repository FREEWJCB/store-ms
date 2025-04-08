import { Injectable } from '@nestjs/common';
import { Order } from '@/modules/orders/schemas/order.schema';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { Op } from 'sequelize';
import {CartStatusEnum} from '@modules/carts/enums/cart.status.enum';
import { OrderCartRepository } from '@/modules/order-carts/repositories/order.cart.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private cartRepository: CartRepository,
    private orderCartRepository: OrderCartRepository
  ) {}

  public async create(body: Partial<Order>): Promise<Order> {
    const carts = await this.cartRepository.lists();
    const order = await this.orderRepository.create(body);
    await this.orderCartRepository.createBulk(
      carts.map((cart) => ({
        orderId: order.id,
        cartId: cart.id,
      })),
    );
    await this.cartRepository.update(
      { id: { [Op.in]: carts.map((cart) => cart.id) } },
      { status: CartStatusEnum.FINISHED },
    );
    return order;
  }
}
