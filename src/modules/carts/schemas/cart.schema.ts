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

export interface CartInterface extends ModelBaseInterface {
  stock: number;
  status: CartStatusEnum;
  productId: string;
  product?: Product;
}

@Table({
  tableName: 'carts',
  timestamps: true,
  paranoid: true,
})
export class Cart extends ModelBase implements CartInterface {
  @ApiProperty(cartsSwagger.stock)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare stock: number;

  @ApiProperty(cartsSwagger.status)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: CartStatusEnum.PENDING,
  })
  declare status: CartStatusEnum;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare productId: string;

  @BelongsTo(() => Product, {
    onDelete: 'SET NULL',
    targetKey: 'id',
  })
  declare product?: Product;
}
