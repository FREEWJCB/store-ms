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

export interface ModelBaseInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | undefined;
}

@Table({
  timestamps: true,
  paranoid: true,
})
export class ModelBase extends Model<ModelBaseInterface> {
  @ApiProperty({
    description: 'The table ID',
    type: 'string',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryKey
  @Default(uuidv4)
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
