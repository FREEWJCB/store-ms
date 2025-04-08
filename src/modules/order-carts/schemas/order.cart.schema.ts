import {Column, DataType, Table, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {
  ModelBase,
  ModelBaseInterface,
} from '@modules/_global/schemas/model.schema';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { Order } from '@/modules/orders/schemas/order.schema';

export interface OrderCartInterface extends ModelBaseInterface {
    cartId: string;
    cart?: Cart;
    orderId: string;
    order?: Order;
}

@Table({
  tableName: 'order_carts',
  timestamps: true,
  paranoid: true,
})
export class OrderCart extends ModelBase implements OrderCartInterface {
    @ForeignKey(() => Order)
    @Column({
      type: DataType.UUID,
      allowNull: true,
    })
    declare orderId: string;

    @BelongsTo(() => Order, {
      onDelete: 'SET NULL',
      targetKey: 'id',
    })
    declare order?: Order;

    @ForeignKey(() => Cart)
    @Column({
      type: DataType.UUID,
      allowNull: true,
    })
    declare cartId: string;

    @BelongsTo(() => Cart, {
      onDelete: 'SET NULL',
      targetKey: 'id',
    })
    declare cart?: Cart;
}
