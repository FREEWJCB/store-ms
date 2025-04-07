import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ordersSwagger } from '@modules/orders/swaggers/order.swagger';
import { Order } from '@modules/orders/schemas/order.schema';

export class OrderCreateDto {
  @ApiProperty(ordersSwagger.price)
  @IsNumber({}, { message: 'Price must be a valid number' })
  @IsPositive({ message: 'Price must be a positive number' })
  @IsNotEmpty({ message: 'Price is required' })
  price!: number;

  public toPartial(): Partial<Order> {
    return <Partial<Order>>{
      price: this.price,
    };
  }
}