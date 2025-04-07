import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDecimal, IsPositive } from 'class-validator';
import {ordersSwagger} from '@modules/orders/swaggers/order.swagger';
import { Order } from '@modules/orders/schemas/order.schema';

export class OrderCreateDto {
  @ApiProperty(ordersSwagger.price)
  @IsDecimal({ decimal_digits: '1,2' }, { message: 'Price must have up to 2 decimal places' })
  @IsPositive({ message: 'Price must be a positive number' })
  @IsNotEmpty({ message: 'Price is required' })
  price!: number;

  public toPartial(): Partial<Order> {
    return <Partial<Order>>{
      price: this.price,
    };
  }
}