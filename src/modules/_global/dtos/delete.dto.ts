import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteDto implements Record<string, unknown> {
  [key: string]: unknown; // Permite propiedades adicionales dinámicas

  @ApiPropertyOptional({ type: Boolean, description: 'Force delete' }) // Documentación opcional para Swagger
  @IsOptional() // Marca el campo como opcional en la validación
  @Transform(({ value }): boolean | undefined =>
    value !== undefined ? value === true || value === 'true' : undefined, // Transforma "true" (string) o true (boolean) en boolean
  )
  @IsBoolean() // Valida que el valor sea booleano
  public force?: boolean; // Indica si la eliminación debe forzarse
}
