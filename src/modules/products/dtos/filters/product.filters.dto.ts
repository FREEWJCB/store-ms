import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Product } from '@/modules/products/schemas/product.schema';
import { castToQueryFilter } from '@/modules/_global/functions/instance.check';
import { WhereOptions, Op } from 'sequelize';
import { productsSwagger } from '@modules/products/swaggers/product.swagger';

interface ProductFiltersDtoConstructor {
  name: string;
}
export class ProductFiltersDto implements Record<string, unknown> {
  [key: string]: unknown;

  constructor(dto: ProductFiltersDtoConstructor | undefined = undefined) {
    this.name = dto?.name;
  }

  @Expose()
  @ApiPropertyOptional({
    name: 'filters[name]',
    ...productsSwagger.name,
    description: 'Filter by name',
  })
  @IsOptional()
  @IsString({ each: true })
  public name?: string | undefined;

  @Type()
  public toQueryFilter(): WhereOptions<Product> {
    return castToQueryFilter<Product, ProductFiltersDto>(
      this,
      [
        'name',
      ],
      (key, query) => {
        switch (key) {
          case 'name':
            (query as any).fullName = { [Op.iLike]: `%${this[key]!}%` };
            break;
        }
        return query;
      },
    );
  }
}
