import { Module } from '@nestjs/common';
import { CartController } from '@/modules/carts/controllers/cart.controller';
import { CartService } from '@/modules/carts/services/cart.service';
import { CartRepository } from '@/modules/carts/repositories/cart.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import * as models from '@/modules/_global/config/models';
import { ProductRepository } from '@modules/products/repositories/product.repository';
import { CartSeeder } from '@modules/carts/seeders/cart.seeder';

@Module({
  // Se importan los modelos registrados para Sequelize dentro del módulo, necesarios para las operaciones con la base de datos
  imports: [SequelizeModule.forFeature(Object.values(models))],

  // Se registra el controlador del carrito que manejará las peticiones HTTP
  controllers: [CartController],

  // Se registran los servicios y repositorios que serán usados dentro del módulo
  providers: [CartService, CartRepository, ProductRepository, CartSeeder],

  // Se exporta el servicio de carrito para que pueda ser usado en otros módulos
  exports: [CartService, CartSeeder],
})
export class CartModule {}
