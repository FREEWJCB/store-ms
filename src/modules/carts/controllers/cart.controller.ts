import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
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
import { CartUpdateDto } from '@modules/carts/dtos/cart.update.dto';
import { DeleteDto } from '@/modules/_global/dtos/delete.dto';

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
    // Devuelve la lista de carritos
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
    // Crea un nuevo carrito con los datos del cuerpo de la solicitud
    return this.cartService.create(body.toPartial());
  }

  @Patch('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update cart by id' })
  @ApiCreatedResponse({
    description: 'Cart successfully updated',
    type: Cart,
  })
  public async update(
    @Param('id') id: string,
    @Body() body: CartUpdateDto,
  ): Promise<[affectedCount: number, affectedRows: Cart[]]> {
    // Actualiza un carrito específico por su id
    return this.cartService.update(id, body.toPartial());
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete cart by id' })
  @ApiOkResponse({
    description: 'Cart successfully deleted',
    type: Cart,
  })
  public async clean(
    @Body() dto: DeleteDto,
  ): Promise<number> {
    // Elimina todos los carritos, con opción forzada si se indica
    return this.cartService.clean(dto.force);
  }

  @Delete('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete cart by id' })
  @ApiOkResponse({
    description: 'Cart successfully deleted',
    type: Cart,
  })
  public async delete(
    @Param('id') id: string,
    @Body() dto: DeleteDto,
  ): Promise<number> {
    // Elimina un carrito específico por su id, con opción forzada si se indica
    return this.cartService.delete(id, dto.force);
  }
}
