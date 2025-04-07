import {
Controller,
HttpStatus,
Res,
Get,
Query,
} from '@nestjs/common';
import {
ApiOperation,
ApiOkResponse,
getSchemaPath,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { ProductListDto } from '@/modules/products/dtos/product.lists.dto';
import { Product } from '@/modules/products/schemas/product.schema';
import { ProductService } from '@/modules/products/services/product.service';

@Controller('/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @ApiOperation({ summary: 'List of products' })
    @ApiOkResponse({
        schema: {
            type: 'array',
            items: { $ref: getSchemaPath(Product) },
            description: 'List of products',},
    })
    public async index(
        @Query() query: ProductListDto,
        @Res() response: Response,
    ): Promise<Response> {
        return response
        .status(HttpStatus.OK)
        .json(await this.productService.lists(query));
    }
}
