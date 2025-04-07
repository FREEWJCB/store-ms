import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, Min, IsInt, IsOptional } from 'class-validator';
import { CartStatusEnum } from '@modules/carts/enums/cart.status.enum';
import {cartsSwagger} from '@modules/carts/swaggers/cart.swagger';
import {Cart} from '@modules/carts/schemas/cart.schema';

export class CartUpdateDto {
  @ApiPropertyOptional(cartsSwagger.stock)
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Stock must be at least 1' })
  stock?: number;

  @ApiPropertyOptional(cartsSwagger.status)
  @IsOptional()
  @IsEnum(CartStatusEnum, { message: 'Status must be a valid CartStatusEnum value' })
  status?: CartStatusEnum;

    public toPartial(): Partial<Cart> {
      return <Partial<Cart>>{
        stock: this.stock,
        status: this.status,
      };
    }
}