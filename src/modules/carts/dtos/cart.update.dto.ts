import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, Min, IsInt, IsOptional } from 'class-validator';
import { CartStatusEnum } from '@modules/carts/enums/cart.status.enum';
import { cartsSwagger } from '@modules/carts/swaggers/cart.swagger';
import { Cart } from '@modules/carts/schemas/cart.schema';

export class CartUpdateDto {
  // Stock opcional a actualizar en el carrito
  @ApiPropertyOptional(cartsSwagger.stock)
  @IsOptional() // Campo no obligatorio
  @IsInt() // Debe ser un número entero
  @Min(1, { message: 'Stock must be at least 1' }) // El valor mínimo permitido es 1
  stock?: number;

  // Estado opcional del carrito a actualizar
  @ApiPropertyOptional(cartsSwagger.status)
  @IsOptional() // Campo no obligatorio
  @IsEnum(CartStatusEnum, { message: 'Status must be a valid CartStatusEnum value' }) // Debe ser un valor válido del enum
  status?: CartStatusEnum;

  // Convierte el DTO a un objeto parcial del modelo Cart
  public toPartial(): Partial<Cart> {
    return <Partial<Cart>>{
      stock: this.stock,
      status: this.status,
    };
  }
}
