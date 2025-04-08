import {Column, DataType, Table, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {
  ModelBase,
  ModelBaseInterface,
} from '@modules/_global/schemas/model.schema';
import { Cart } from '@/modules/carts/schemas/cart.schema';
import { Order } from '@/modules/orders/schemas/order.schema';

// Interfaz que define los atributos del modelo OrderCart
export interface OrderCartInterface extends ModelBaseInterface {
  cartId: string;     // ID del carrito relacionado
  cart?: Cart;        // Instancia opcional del carrito asociado
  orderId: string;    // ID del pedido relacionado
  order?: Order;      // Instancia opcional del pedido asociado
}

@Table({
  tableName: 'order_carts', // Nombre de la tabla en la base de datos
  timestamps: true,         // Habilita las columnas createdAt y updatedAt
  paranoid: true,           // Habilita la eliminación lógica con la columna deletedAt
})
export class OrderCart extends ModelBase implements OrderCartInterface {
  // Clave foránea que referencia a la tabla de órdenes
  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,  // Tipo de dato UUID
    allowNull: true,      // Permite valores nulos
  })
  declare orderId: string;

  // Relación "pertenece a" con el modelo Order
  @BelongsTo(() => Order, {
    onDelete: 'SET NULL',  // Si se elimina la orden, se pone el valor de orderId en NULL
    targetKey: 'id',       // Clave primaria de la tabla objetivo
  })
  declare order?: Order;

  // Clave foránea que referencia a la tabla de carritos
  @ForeignKey(() => Cart)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare cartId: string;

  // Relación "pertenece a" con el modelo Cart
  @BelongsTo(() => Cart, {
    onDelete: 'SET NULL',
    targetKey: 'id',
  })
  declare cart?: Cart;
}
