import { ApiPropertyOptions } from '@nestjs/swagger';
import { OrderStatusEnum } from '@modules/orders/enums/order.status.enum';

export const ordersSwagger = {
  price: <ApiPropertyOptions>{
    type: 'number',
    description: 'Precio total de la orden.',
    example: 149.99,
  },
  status: <ApiPropertyOptions>{
    type: 'string',
    description: 'Estado de la orden (pending o finished).',
    enum: OrderStatusEnum,
    example: OrderStatusEnum.FINISHED,
  },
};
