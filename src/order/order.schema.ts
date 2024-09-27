import * as mongoose from 'mongoose';

export enum OrderStatus {
  CREATED = 'Created',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  SHIPPING_IN_PROGRESS = 'Shipping in progress',
  SHIPPED = 'Shipped',
}

export const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  productId: { type: String, required: true },
  customerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.CREATED,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
