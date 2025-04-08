import { Module } from '@nestjs/common';
import { OrderController } from '@/modules/orders/controllers/order.controller';
import { OrderService } from '@/modules/orders/services/order.service';
import { OrderRepository } from '@/modules/orders/repositories/order.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';
import { OrderCartRepository } from '@/modules/order-carts/repositories/order.cart.repository';
import { CartRepository } from '@modules/carts/repositories/cart.repository';

@Module({
  // Importa los modelos definidos para que estén disponibles en este módulo
  imports: [SequelizeModule.forFeature(Object.values(models))],

  // Controlador que manejará las rutas relacionadas con órdenes
  controllers: [OrderController],

  // Proveedores del módulo: servicio y repositorios necesarios
  providers: [OrderService, OrderRepository, CartRepository, OrderCartRepository],

  // Exporta el servicio para que pueda ser usado en otros módulos
  exports: [OrderService],
})
export class OrderModule {}
