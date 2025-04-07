import {Body, Controller, Post, HttpCode} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Order } from '@/modules/orders/schemas/order.schema';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderCreateDto } from '@modules/orders/dtos/order.create.dto';

@ApiTags('Order')
@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a order' })
  @ApiCreatedResponse({
    description: 'Order successfully created',
    type: Order,
  })
  public async create(
    @Body() body: OrderCreateDto,
  ): Promise<Order> {
    return this.orderService.create(body.toPartial());
  }
}
