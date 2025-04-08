import { Module } from '@nestjs/common';
import { ProductController } from '@/modules/products/controllers/product.controller';
import { ProductService } from '@/modules/products/services/product.service';
import { ProductRepository } from '@/modules/products/repositories/product.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductSeeder } from '@modules/products/seeders/product.seeder';
import * as models from '@/modules/_global/config/models';

@Module({
  // 'imports' declara otros módulos que se requieren en este módulo.
  imports: [SequelizeModule.forFeature(Object.values(models))],

  // 'controllers' especifica qué controladores pertenecen a este módulo.
  controllers: [ProductController],
  // 'providers' registra los proveedores que Nest puede inyectar donde se necesiten.
  providers: [ProductService, ProductRepository, ProductSeeder],
  // Aquí se exportan el servicio y el seeder de productos.
  exports: [ProductService, ProductSeeder],
})
export class ProductModule {}
