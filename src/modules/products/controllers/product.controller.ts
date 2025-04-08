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

@ApiTags('Products') // Se agrupan las rutas bajo la etiqueta "Products" en Swagger
@Controller('/product') // Se define el prefijo de la ruta como /product
export class ProductController {
  constructor(private readonly productService: ProductService) {} // Se inyecta el servicio ProductService

  @Get() // Define una ruta GET
  @HttpCode(200) // Establece el código HTTP de respuesta en 200
  @ApiOperation({ summary: 'List of products' }) // Documenta la operación en Swagger
  @ApiOkResponse({
    description: 'List of products', // Describe la respuesta esperada
    schema: {
      type: 'array', // Se espera un arreglo
      items: { $ref: getSchemaPath(Product) }, // Cada ítem es un esquema de tipo Product
    },
  })
  public async index(
    @Query() query: ProductListDto, // Recibe parámetros de consulta validados con ProductListDto
  ): Promise<Product[]> {
    // Llama al método lists del servicio y retorna la lista de productos
    return this.productService.lists(query);
  }
}
