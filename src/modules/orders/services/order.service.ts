import { Injectable } from '@nestjs/common';
import { Order } from '@/modules/orders/schemas/order.schema';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { Op } from 'sequelize';
import { CartStatusEnum } from '@modules/carts/enums/cart.status.enum';
import { OrderCartRepository } from '@/modules/order-carts/repositories/order.cart.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository, // Repositorio para manejar las órdenes
    private cartRepository: CartRepository, // Repositorio para manejar los carritos
    private orderCartRepository: OrderCartRepository, // Repositorio para manejar las relaciones entre órdenes y carritos
  ) {}

  // Método para crear una orden a partir de los carritos activos
  public async create(body: Partial<Order>): Promise<Order> {
    // Obtener la lista de carritos (se asume que están activos o listos para asociar)
    const carts = await this.cartRepository.lists();

    // Crear la orden con los datos proporcionados
    const order = await this.orderRepository.create(body);

    // Crear registros en la tabla pivote entre órdenes y carritos
    await this.orderCartRepository.createBulk(
      carts.map((cart) => ({
        orderId: order.id,
        cartId: cart.id,
      })),
    );

    // Marcar los carritos usados como finalizados
    await this.cartRepository.update(
      { id: { [Op.in]: carts.map((cart) => cart.id) } },
      { status: CartStatusEnum.FINISHED },
    );

    // Retornar la orden creada
    return order;
  }
}
