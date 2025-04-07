import { Injectable } from '@nestjs/common';
import { Order } from '@/modules/orders/schemas/order.schema';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  public async create(body: Partial<Order>): Promise<Order> {
    return this.orderRepository.create(body);
  }
}
