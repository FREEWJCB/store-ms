import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import {
  ModelBase,
  ModelBaseInterface,
} from '@modules/_global/schemas/model.schema';
import { ordersSwagger } from '@modules/orders/swaggers/order.swagger';
import { OrderStatusEnum } from '@modules/orders/enums/order.status.enum';

// Esta interfaz define la estructura esperada de un Order,
// incluyendo los campos heredados de ModelBaseInterface.
export interface OrderInterface extends ModelBaseInterface {
  price: number; // Precio total de la orden
  status: OrderStatusEnum; // Estado de la orden (por ejemplo: FINISHED, PENDING, etc.)
}

// Decorador que marca esta clase como un modelo de Sequelize.
// Define el nombre de la tabla, uso de timestamps y soporte para borrado lógico (paranoid).
@Table({
  tableName: 'orders',
  timestamps: true,
  paranoid: true,
})
export class Order extends ModelBase implements OrderInterface {
  // Define la columna "price" como DECIMAL(10,2), obligatoria.
  // También se incluye una propiedad de Swagger para documentación automática.
  @ApiProperty(ordersSwagger.price)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  // Define la columna "status" como string, obligatoria, con valor por defecto "FINISHED".
  // También se anota con ApiProperty para Swagger.
  @ApiProperty(ordersSwagger.status)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: OrderStatusEnum.FINISHED,
  })
  declare status: OrderStatusEnum;
}
