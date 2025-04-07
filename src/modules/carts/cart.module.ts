import { Module } from '@nestjs/common';
import { CartController } from '@/modules/carts/controllers/cart.controller';
import { CartService } from '@/modules/carts/services/cart.service';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';
import { ProductRepository } from '@modules/products/repositories/product.repository';

@Module({
  imports: [SequelizeModule.forFeature(Object.values(models))],
  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository],
  exports: [CartService],
})
export class CartModule {}
