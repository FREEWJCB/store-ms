import { Module } from '@nestjs/common';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';
import { OrderCartRepository } from '@/modules/order-carts/repositories/order.cart.repository';
import { CartRepository } from '@modules/carts/repositories/cart.repository';

@Module({
  imports: [SequelizeModule.forFeature(Object.values(models))],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, CartRepository, OrderCartRepository],
  exports: [OrderService],
})
export class OrderModule {}
