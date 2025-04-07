import { Injectable } from '@nestjs/common';
import { Product } from '@/modules/products/schemas/product.schema';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { ProductListDto } from '@/modules/products/dtos/product.lists.dto';

@Injectable()
export class ProductService {
  constructor(private tableRepository: ProductRepository) {}

  public async lists(query: ProductListDto): Promise<Product[]> {
    return this.tableRepository.lists(query.toQueryOptions());
  }
}
