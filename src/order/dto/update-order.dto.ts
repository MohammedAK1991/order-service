import { OrderStatus } from '../order.schema';

export class UpdateOrderDto {
  status?: OrderStatus;
  price?: number;
  quantity?: number;
}
