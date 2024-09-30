import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsString,
  IsEnum,
} from 'class-validator';
import { OrderStatus } from '../order.schema';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  sellerId?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
