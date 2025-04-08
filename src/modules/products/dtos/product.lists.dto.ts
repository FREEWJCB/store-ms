import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductFiltersDto } from '@/modules/products/dtos/filters/product.filters.dto';
import { withoutEmpty } from '@/modules/_global/functions/sanitize';
import { Product } from '@modules/products/schemas/product.schema';
import { FindOptions } from 'sequelize';

export class ProductListDto implements Record<string, unknown> {
  // Permite definir claves dinámicas con cualquier valor
  [key: string]: unknown;

  @Expose() // Expone esta propiedad durante la transformación con class-transformer
  @ApiPropertyOptional({
    description: 'Filter options', // Descripción del campo en Swagger
    type: ProductFiltersDto, // Define el tipo del objeto anidado
  })
  @IsOptional() // Este campo es opcional
  @IsNotEmptyObject() // No debe ser un objeto vacío
  @IsObject() // Debe ser un objeto
  @ValidateNested() // Valida los campos del objeto anidado
  @Type(() => ProductFiltersDto) // Transforma el valor a una instancia de ProductFiltersDto
  public filters?: ProductFiltersDto | undefined; // Filtro opcional que encapsula filtros más específicos

  @ApiPropertyOptional({
    description: 'Limit records', // Descripción del campo para Swagger
    example: 50, // Valor de ejemplo en la documentación
  })
  @IsOptional() // Campo opcional
  @Transform((params) => (params.value ? Number(params.value) : undefined)) // Convierte el valor a número si está presente
  @IsNumber({ maxDecimalPlaces: 0 }) // Debe ser un número entero
  @Min(1) // Mínimo valor aceptado
  @Max(100) // Máximo valor aceptado
  public limit?: number | undefined; // Define un límite opcional para la cantidad de registros

  public toQueryOptions(): FindOptions<Product> {
    // Convierte los filtros del DTO en una opción usable por Sequelize
    return withoutEmpty<FindOptions<Product>>(<FindOptions<Product>>{
      ...(this.filters && { where: this.filters?.toQueryFilter() }), // Si hay filtros, se incluyen en la cláusula WHERE
      limit: this.limit, // Si hay límite, se incluye como parte de la consulta
    });
  }
}
