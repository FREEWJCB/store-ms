import { Controller, Get, Query, HttpCode } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { ProductListDto } from '@/modules/products/dtos/product.lists.dto';
import { Product } from '@/modules/products/schemas/product.schema';
import { ProductService } from '@/modules/products/services/product.service';

@ApiTags('Products')
@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List of products' })
  @ApiOkResponse({
    description: 'List of products',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(Product) },
    },
  })
  public async index(
    @Query() query: ProductListDto,
  ): Promise<Product[]> {
    return this.productService.lists(query);
  }
}
