import { Module } from '@nestjs/common';
import { ProductController } from '@/modules/products/controllers/product.controller';
import { ProductService } from '@/modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductSeeder } from '@modules/products/seeders/product.seeder';
import * as models from '@/modules/_global/config/models';

@Module({
  imports: [SequelizeModule.forFeature(Object.values(models))],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductSeeder],
  exports: [ProductService, ProductSeeder],
})
export class ProductModule {}
