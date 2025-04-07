import { Injectable } from '@nestjs/common';
import { Product } from '@/modules/products/schemas/product.schema';
import { FindOptions } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product)
    private readonly genre: typeof Product,
  ) {}

  public async lists(query: FindOptions<Product>): Promise<Product[]> {
    return this.genre.findAll(query);
  }
}
