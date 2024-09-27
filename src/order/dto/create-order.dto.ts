export class CreateOrderDto {
  orderId: string;
  price: number;
  quantity: number;
  productId: string;
  customerId: string;
  sellerId: string;
}
