import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteDto implements Record<string, unknown> {
  [key: string]: unknown;

  @ApiPropertyOptional({ type: Boolean, description: 'Force delete' })
  @IsOptional()
  @Transform(({ value }): boolean | undefined =>
    value !== undefined ? value === true || value === 'true' : undefined,
  )
  @IsBoolean()
  public force?: boolean;
}
