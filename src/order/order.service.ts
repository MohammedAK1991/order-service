import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PubSubService } from '../pubsub/pubsub.service';
import { TOPIC_NAME } from 'src/constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly pubSubService: PubSubService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
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

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    await this.publishOrderEvent(updatedOrder);
    return updatedOrder;
  }

  async delete(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  private async publishOrderEvent(order: Order): Promise<void> {
    const messageData = {
      orderId: order.orderId,
      status: order.status,
      updatedAt: order.updatedAt,
    };

    try {
      const messageId = await this.pubSubService.publishMessage(
        TOPIC_NAME,
        messageData,
      );
      console.log(`Message ${messageId} published for order ${order.orderId}`);
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  }
}
