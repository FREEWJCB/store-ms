import {Body, Controller, Post, HttpCode} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Order } from '@/modules/orders/schemas/order.schema';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderCreateDto } from '@modules/orders/dtos/order.create.dto';

@ApiTags('Order') // Agrega una etiqueta para agrupar los endpoints relacionados con órdenes en Swagger
@Controller('/order') // Define la ruta base del controlador: /order
export class OrderController {
  constructor(private readonly orderService: OrderService) {} // Inyecta el servicio que maneja la lógica de órdenes

  @Post() // Define un endpoint POST para crear una orden
  @HttpCode(201) // Devuelve el código HTTP 201 (Created) si la operación es exitosa
  @ApiOperation({ summary: 'Create a order' }) // Describe brevemente la operación para Swagger
  @ApiCreatedResponse({
    description: 'Order successfully created', // Descripción de la respuesta en Swagger
    type: Order, // Tipo de entidad que devuelve el endpoint
  })
  public async create(
    @Body() body: OrderCreateDto, // Recibe el cuerpo de la solicitud como un DTO
  ): Promise<Order> {
    // Llama al servicio para crear la orden usando el DTO convertido a objeto parcial
    return this.orderService.create(body.toPartial());
  }
}
