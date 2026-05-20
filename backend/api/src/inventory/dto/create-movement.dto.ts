import { MovementType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateMovementDto {
  @IsUUID()
  productId!: string;

  @IsEnum(MovementType)
  movementType!: MovementType;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observation?: string;
}
