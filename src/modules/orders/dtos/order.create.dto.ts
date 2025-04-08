import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ordersSwagger } from '@modules/orders/swaggers/order.swagger';
import { Order } from '@modules/orders/schemas/order.schema';

export class OrderCreateDto {
  @ApiProperty(ordersSwagger.price) // Define cómo se documentará esta propiedad en Swagger
  @IsNumber({}, { message: 'Price must be a valid number' }) // Valida que el valor sea numérico
  @IsPositive({ message: 'Price must be a positive number' }) // Valida que el número sea positivo
  @IsNotEmpty({ message: 'Price is required' }) // Valida que no esté vacío
  price!: number; // Campo obligatorio que representa el precio de la orden

  public toPartial(): Partial<Order> {
    // Método auxiliar para convertir el DTO en un objeto parcial de tipo Order
    return <Partial<Order>>{
      price: this.price,
    };
  }
}
