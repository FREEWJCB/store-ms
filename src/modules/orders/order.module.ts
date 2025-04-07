import { Module } from '@nestjs/common';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';

@Module({
  imports: [SequelizeModule.forFeature(Object.values(models))],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
