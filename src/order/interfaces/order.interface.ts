import { Document } from 'mongoose';
import { OrderStatus } from '../order.schema';

export interface Order extends Document {
  orderId: string;
  price: number;
  quantity: number;
  productId: string;
  customerId: string;
  sellerId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
