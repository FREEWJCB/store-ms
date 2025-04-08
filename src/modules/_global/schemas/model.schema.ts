import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Model,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

// Interfaz base para tipar las propiedades comunes de los modelos
export interface ModelBaseInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | undefined;
}

// Modelo base abstracto que contiene campos comunes como id, createdAt, etc.
@Table({
  timestamps: true, // Sequelize generará automáticamente createdAt y updatedAt
  paranoid: true,   // Habilita el soft delete (usa deletedAt en vez de borrar el registro)
})
export class ModelBase extends Model<ModelBaseInterface> {
  @ApiProperty({
    description: 'The table ID',
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryKey
  @Default(uuidv4) // Genera un UUID por defecto
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare id: string;

  @ApiProperty({
    description: 'The creation date',
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @ApiProperty({
    description: 'The update date',
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare updatedAt: Date;

  @ApiPropertyOptional({
    description: 'The deletion date',
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt?: Date | undefined;
}
