import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { CartService } from '@/modules/carts/services/cart.service';
import { CartCreateDto } from '@modules/carts/dtos/cart.create.dto';

@ApiTags('Carts')
@Controller('/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a cart' })
  @ApiCreatedResponse({
    description: 'Cart successfully created',
    type: Cart,
  })
  public async create(
    @Body() body: CartCreateDto,
  ): Promise<Cart> {
    return this.cartService.create(body.toPartial());
  }
}
