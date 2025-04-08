import { Injectable } from '@nestjs/common';
import { Product } from '@/modules/products/schemas/product.schema';
import { FindOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
// Declaramos un repositorio de productos que se puede inyectar como dependencia
export class ProductRepository {
  // Inyectamos el modelo de Sequelize para el esquema `Product`
  constructor(
    @InjectModel(Product)
    private readonly product: typeof Product, // Este es el modelo Sequelize del producto
  ) {}

  // Método que retorna una lista de productos usando opciones Sequelize
  public async lists(query: FindOptions<Product>): Promise<Product[]> {
    // Ejecuta una consulta findAll con filtros, límite, etc. definidos en `query`
    return this.product.findAll(query);
  }
}
