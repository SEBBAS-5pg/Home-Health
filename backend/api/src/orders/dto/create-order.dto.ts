import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsString, IsUUID, Min, ValidateNested, MaxLength } from 'class-validator';

export class OrderItemInput {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemInput)
  items!: OrderItemInput[];

  @IsString()
  @MaxLength(255)
  deliveryAddress!: string;
}
