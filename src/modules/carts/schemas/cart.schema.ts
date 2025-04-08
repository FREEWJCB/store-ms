import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import {
  ModelBase,
  ModelBaseInterface,
} from '@modules/_global/schemas/model.schema';
import { cartsSwagger } from '@modules/carts/swaggers/cart.swagger';
import { Product } from '@/modules/products/schemas/product.schema';
import { CartStatusEnum } from '@modules/carts/enums/cart.status.enum';

// Interfaz que representa los atributos que debe tener una instancia del modelo Cart
export interface CartInterface extends ModelBaseInterface {
  stock: number;
  status: CartStatusEnum;
  productId: string;
  product?: Product;
}

@Table({
  tableName: 'carts',     // Nombre de la tabla en la base de datos
  timestamps: true,       // Habilita automáticamente las columnas createdAt y updatedAt
  paranoid: true,         // Habilita la columna deletedAt para soft deletes
})
export class Cart extends ModelBase implements CartInterface {
  // Cantidad de stock solicitada para el producto en el carrito
  @ApiProperty(cartsSwagger.stock)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,     // El campo es obligatorio
  })
  declare stock: number;

  // Estado del carrito (PENDING, FINISHED, etc.)
  @ApiProperty(cartsSwagger.status)
  @Column({
    type: DataType.STRING,
    allowNull: false,     // El campo es obligatorio
    defaultValue: CartStatusEnum.PENDING, // Valor por defecto si no se especifica
  })
  declare status: CartStatusEnum;

  // Llave foránea que referencia al producto agregado al carrito
  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: true,      // Puede ser null si se elimina el producto
  })
  declare productId: string;

  // Relación con el modelo Product (uno a uno)
  @BelongsTo(() => Product, {
    onDelete: 'SET NULL', // Si se elimina el producto, se setea a null en el carrito
    targetKey: 'id',      // Se relaciona usando la columna 'id' del modelo Product
  })
  declare product?: Product;
}
