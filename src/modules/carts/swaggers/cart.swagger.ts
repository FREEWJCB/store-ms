import { ApiPropertyOptions } from '@nestjs/swagger';
import {CartStatusEnum} from '@modules/carts/enums/cart.status.enum';

export const cartsSwagger = {
  stock: <ApiPropertyOptions>{
    type: 'number',
    description: 'Cantidad de productos en el carrito.',
    example: 3,
  },
  status: <ApiPropertyOptions>{
    type: 'string',
    description: 'Estado del carrito (pending o finished).',
    enum: CartStatusEnum,
    example: CartStatusEnum.PENDING,
  },
  productId: <ApiPropertyOptions>{
    type: 'string',
    description: 'ID del producto asociado al carrito.',
    example: '6d8e1fbb-cd47-49e1-b5bc-4fd9d0210c58',
  },
};
