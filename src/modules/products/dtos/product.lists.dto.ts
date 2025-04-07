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
  [key: string]: unknown;

  @Expose()
  @ApiPropertyOptional({
    description: 'Filter options',
    type: ProductFiltersDto,
  })
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ProductFiltersDto)
  public filters?: ProductFiltersDto | undefined;

  @ApiPropertyOptional({
    description: 'Limit records',
    example: 50,
  })
  @IsOptional()
  @Transform((params) => (params.value ? Number(params.value) : undefined))
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(100)
  public limit?: number | undefined;

  public toQueryOptions(): FindOptions<Product> {

    return withoutEmpty<FindOptions<Product>>(<FindOptions<Product>>{
      ...(this.filters && { where: this.filters?.toQueryFilter() }),
      limit: this.limit,
    });
  }
}
