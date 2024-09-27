import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import { Order } from './interfaces/order.interface';
import { AllExceptionsFilter } from '../common/http-exception.filter';

@Controller('orders')
@UseFilters(AllExceptionsFilter)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async listOrders(@Query('sellerId') sellerId: string): Promise<Order[]> {
    try {
      return await this.orderService.findAll(sellerId);
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve orders: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string): Promise<Order> {
    try {
      const order = await this.orderService.findOne(orderId);
      if (!order) {
        throw new HttpException(
          `Order with ID ${orderId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to retrieve order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      const updatedOrder = await this.orderService.update(
        orderId,
        updateOrderDto,
      );
      if (!updatedOrder) {
        throw new HttpException(
          `Order with ID ${orderId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedOrder;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to update order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':orderId')
  async deleteOrder(@Param('orderId') orderId: string): Promise<void> {
    try {
      await this.orderService.delete(orderId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to delete order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
