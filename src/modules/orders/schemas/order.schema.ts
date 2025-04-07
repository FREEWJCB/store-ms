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

export interface OrderInterface extends ModelBaseInterface {
  price: number;
  status: OrderStatusEnum;
}

@Table({
  tableName: 'orders',
  timestamps: true,
  paranoid: true,
})
export class Order extends ModelBase implements OrderInterface {
  @ApiProperty(ordersSwagger.price)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: number;

  @ApiProperty(ordersSwagger.status)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: OrderStatusEnum.FINISHED,
  })
  declare status: OrderStatusEnum;
}
