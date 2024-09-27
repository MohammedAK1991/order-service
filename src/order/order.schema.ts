import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OrderStatus {
  CREATED = 'Created',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  SHIPPING_IN_PROGRESS = 'Shipping in progress',
  SHIPPED = 'Shipped',
}

@Schema()
export class Order extends Document {
  @Prop({ required: true, unique: true })
  orderId: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  sellerId: string;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
