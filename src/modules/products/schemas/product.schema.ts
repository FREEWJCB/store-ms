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

// Definimos la interfaz que representa la estructura del modelo de Producto
export interface ProductInterface extends ModelBaseInterface {
  name: string;       // Nombre del producto
  price: number;      // Precio del producto
  stock: number;      // Cantidad en stock
  imageURL: string;   // URL de la imagen del producto
}

// Decorador que define este modelo como una tabla de Sequelize
@Table({
  tableName: 'products',  // Nombre de la tabla en la base de datos
  timestamps: true,       // Agrega columnas createdAt y updatedAt automáticamente
  paranoid: true,         // Agrega soporte para borrado lógico con la columna deletedAt
})
// Clase que representa el modelo de Producto y hereda de ModelBase
export class Product extends ModelBase implements ProductInterface {
  // Define la propiedad 'name' con documentación para Swagger
  @ApiProperty(productsSwagger.name)
  @Column({
    type: DataType.STRING,  // Tipo de dato en la base de datos
    allowNull: false,       // No permite valores nulos
  })
  declare name: string;     // Declaramos explícitamente el tipo de la propiedad

  // Define la propiedad 'price' con documentación para Swagger
  @ApiProperty(productsSwagger.price)
  @Column({
    type: DataType.DECIMAL(10, 2), // Tipo decimal con precisión
    allowNull: false,
  })
  declare price: number;

  // Define la propiedad 'stock' con documentación para Swagger
  @ApiProperty(productsSwagger.stock)
  @Column({
    type: DataType.INTEGER, // Entero para representar el stock
    allowNull: false,
  })
  declare stock: number;

  // Define la propiedad 'imageURL' con documentación para Swagger
  @ApiProperty(productsSwagger.imageURL)
  @Column({
    type: DataType.STRING, // Cadena de texto para la URL
    allowNull: false,
  })
  declare imageURL: string;
}
