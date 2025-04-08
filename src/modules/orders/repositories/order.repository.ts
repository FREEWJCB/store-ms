import { Inject, Injectable } from '@nestjs/common';
import { Order } from '@/modules/orders/schemas/order.schema';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order)
    private readonly order: typeof Order, // Inyección del modelo Order para acceder a sus métodos
    @Inject(Sequelize) private readonly sequelize: Sequelize, // Inyección de la instancia de Sequelize para manejar transacciones
  ) {}

  public async create(attribute: Partial<Order>): Promise<Order> {
    // Inicia una transacción para asegurar que la creación sea atómica
    const transaction = await this.sequelize.transaction();

    try {
      // Crea una nueva orden en la base de datos con los atributos proporcionados
      const result = await this.order.create(attribute as Order, {
        transaction,
      });

      // Si todo salió bien, confirma la transacción
      await transaction.commit();

      // Devuelve el resultado (la nueva orden creada)
      return result;
    } catch (error) {
      // Si ocurre algún error, revierte la transacción
      await transaction.rollback();

      // Lanza el error para que sea manejado en capas superiores
      throw error;
    }
  }
}
