import { Inject, Injectable } from '@nestjs/common';
import { OrderCart } from '@/modules/order-carts/schemas/order.cart.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OrderCartRepository {
  constructor(
    // Inyección del modelo OrderCart para realizar operaciones en la base de datos
    @InjectModel(OrderCart)
    private readonly order: typeof OrderCart,
    // Inyección de la instancia de Sequelize para poder manejar transacciones manualmente
    @Inject(Sequelize) private readonly sequelize: Sequelize,
  ) {}

  // Método para crear múltiples registros de OrderCart en una sola operación
  public async createBulk(attributes: Partial<OrderCart>[]): Promise<OrderCart[]> {
    // Se inicia una transacción manual
    const transaction = await this.sequelize.transaction();

    try {
      // Se insertan todos los registros en la base de datos dentro de la transacción
      const results = await this.order.bulkCreate(attributes as OrderCart[], {
        transaction,
      });

      // Se confirma la transacción si todo sale bien
      await transaction.commit();
      return results;
    } catch (error) {
      // Si hay error, se revierte la transacción para evitar datos corruptos
      await transaction.rollback();
      throw error;
    }
  }
}
