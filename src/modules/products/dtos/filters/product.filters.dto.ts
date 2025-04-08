import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Product } from '@/modules/products/schemas/product.schema';
import { castToQueryFilter } from '@/modules/_global/functions/instance.check';
import { WhereOptions, Op } from 'sequelize';
import { productsSwagger } from '@modules/products/swaggers/product.swagger';

export class ProductFiltersDto implements Record<string, unknown> {
  // Permite indexar con cualquier string y asociarlo a un valor desconocido
  [key: string]: unknown;

  @Expose() // Marca la propiedad para ser incluida en la transformación con class-transformer
  @ApiPropertyOptional({
    name: 'filters[name]',
    ...productsSwagger.name, // Usa la definición Swagger del nombre desde un archivo centralizado
    description: 'Filter by name', // Describe el filtro como búsqueda por nombre
  })
  @IsOptional() // Marca el campo como opcional
  @IsString({ each: true }) // Valida que sea un string (o array de strings)
  public name?: string | undefined; // Filtro opcional por nombre

  @Type() // Marca este método como parte del DTO transformado por class-transformer
  public toQueryFilter(): WhereOptions<Product> {
    // Convierte los filtros del DTO en una cláusula Sequelize (WhereOptions)
    return castToQueryFilter<Product, ProductFiltersDto>(
      this, // Instancia actual del DTO
      [
        'name', // Lista de campos a procesar como filtros
      ],
      (key, query) => {
        // Callback que modifica el query en función del campo
        switch (key) {
          case 'name':
            // Si el campo es "name", aplica una búsqueda case-insensitive (ILIKE)
            (query as any).name = { [Op.iLike]: `%${this[key]!}%` };
            break;
        }
        return query; // Devuelve el query modificado
      },
    );
  }
}
