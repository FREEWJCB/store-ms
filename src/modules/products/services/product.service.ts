import { Injectable } from '@nestjs/common';
import { Product } from '@/modules/products/schemas/product.schema';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { ProductListDto } from '@/modules/products/dtos/product.lists.dto';

@Injectable() // Marca esta clase como un proveedor inyectable dentro del sistema de inyección de dependencias de NestJS
export class ProductService {
  // Inyecta el repositorio de productos a través del constructor
  constructor(private tableRepository: ProductRepository) {}

  // Método público para obtener una lista de productos con filtros opcionales
  public async lists(query: ProductListDto): Promise<Product[]> {
    // Convierte el DTO de consulta en opciones Sequelize y consulta los productos desde el repositorio
    return this.tableRepository.lists(query.toQueryOptions());
  }
}
