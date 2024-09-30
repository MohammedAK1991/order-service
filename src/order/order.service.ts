import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { v4 as uuidv4 } from 'uuid';
import { pubsubClient, TOPIC_NAME } from '../config/pubsub.config';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      orderId: uuidv4(),
      status: OrderStatus.CREATED,
    });
    const savedOrder = await createdOrder.save();
    await this.publishOrderEvent(savedOrder);
    return savedOrder;
  }

  async findAll(sellerId?: string): Promise<Order[]> {
    if (sellerId) {
      return this.orderModel.find({ sellerId }).exec();
    }
    return this.orderModel.find().exec();
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
    await this.publishOrderEvent(updatedOrder);
    return updatedOrder;
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findOneAndUpdate(
        { orderId },
        { status, updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    await this.publishOrderEvent(updatedOrder);
    return updatedOrder;
  }

  async delete(orderId: string): Promise<void> {
    const result = await this.orderModel.deleteOne({ orderId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }

  private async publishOrderEvent(order: Order): Promise<void> {
    const messageData = JSON.stringify({
      orderId: order.orderId,
      status: order.status,
      updatedAt: order.updatedAt,
    });

    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer = Buffer.from(messageData);

    try {
      const messageId = await pubsubClient
        .topic(TOPIC_NAME)
        .publishMessage({ data: dataBuffer });
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }
}
