import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Min, IsInt } from 'class-validator';
import {cartsSwagger} from '@modules/carts/swaggers/cart.swagger';
import { Cart } from '@modules/carts/schemas/cart.schema';

export class CartCreateDto {
  @ApiProperty(cartsSwagger.stock)
  @IsInt()
  @Min(1, { message: 'Stock must be at least 1' })
  stock!: number;

  @ApiProperty(cartsSwagger.productId)
  @IsUUID()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId!: string;

  public toPartial(): Partial<Cart> {
    return <Partial<Cart>>{
      stock: this.stock,
      productId: this.productId,
    };
  }
}