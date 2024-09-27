import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order-dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_MODEL')
    private orderModel: Model<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(sellerId?: string): Promise<Order[]> {
    const query = sellerId ? { sellerId } : {};
    return this.orderModel.find(query).exec();
  }

  async findOne(orderId: string): Promise<Order> {
    const order = await this.orderModel.findOne({ orderId }).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findOneAndUpdate({ orderId }, updateOrderDto, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return updatedOrder;
  }

  async delete(orderId: string): Promise<void> {
    const result = await this.orderModel.deleteOne({ orderId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }
}
