import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { CartService } from '@/modules/carts/services/cart.service';
import { CartCreateDto } from '@modules/carts/dtos/cart.create.dto';

@ApiTags('Carts')
@Controller('/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List of carts' })
  @ApiOkResponse({
    description: 'List of carts',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(Cart) },
    },
  })
  public async index(): Promise<Cart[]> {
    return this.cartService.lists();
  }

  @Post()
  @HttpCode(201)
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
