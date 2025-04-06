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
import { productsSwagger } from '@modules/products/swaggers/product.swagger';

export interface ProductInterface extends ModelBaseInterface {
  name: string;
  price: number;
  stock: number;
  imageURL: string;
}

@Table({
  tableName: 'products',
  timestamps: true,
  paranoid: true,
})
export class Product extends ModelBase implements ProductInterface {
  @ApiProperty(productsSwagger.name)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @ApiProperty(productsSwagger.price)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @ApiProperty(productsSwagger.stock)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stock!: number;

  @ApiProperty(productsSwagger.imageURL)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  imageURL!: string;
}
