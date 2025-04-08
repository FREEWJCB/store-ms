import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Min, IsInt } from 'class-validator';
import { cartsSwagger } from '@modules/carts/swaggers/cart.swagger';
import { Cart } from '@modules/carts/schemas/cart.schema';

export class CartCreateDto {
  // Stock del producto en el carrito
  @ApiProperty(cartsSwagger.stock)
  @IsInt() // Debe ser un número entero
  @Min(1, { message: 'Stock must be at least 1' }) // Mínimo 1 unidad
  stock!: number;

  // ID del producto al que pertenece este cart
  @ApiProperty(cartsSwagger.productId)
  @IsUUID() // Debe ser un UUID válido
  @IsNotEmpty({ message: 'Product ID is required' }) // No puede estar vacío
  productId!: string;

  // Método que transforma el DTO en un objeto parcial del modelo Cart
  public toPartial(): Partial<Cart> {
    return <Partial<Cart>>{
      stock: this.stock,
      productId: this.productId,
    };
  }
}
