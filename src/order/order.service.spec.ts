import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PubSubService } from '../pubsub/pubsub.service';
import { Order, OrderStatus } from './order.schema';
import { NotFoundException } from '@nestjs/common';
import { TOPIC_NAME } from '../constants';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let model: Model<Order>;
  let pubSubService: PubSubService;

  const mockOrder = {
    _id: 'someId',
    orderId: 'order1',
    sellerId: 'seller1',
    customerId: 'customer1',
    productId: 'product1',
    quantity: 2,
    price: 50,
    status: OrderStatus.CREATED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  class MockOrderModel {
    constructor(private data) {}
    save = jest.fn().mockResolvedValue(mockOrder);
    static find = jest.fn();
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static findByIdAndDelete = jest.fn();
  }

  const mockPubSubService = {
    publishMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: MockOrderModel,
        },
        {
          provide: PubSubService,
          useValue: mockPubSubService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    model = module.get<Model<Order>>(getModelToken(Order.name));
    pubSubService = module.get<PubSubService>(PubSubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockOrder]),
      } as any);

      const orders = await service.findAll();

      expect(orders).toEqual([mockOrder]);
    });

    it('should return orders for a specific seller', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockOrder]),
      } as any);

      const orders = await service.findAll('seller1');

      expect(model.find).toHaveBeenCalledWith({ sellerId: 'seller1' });
      expect(orders).toEqual([mockOrder]);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockOrder),
      } as any);

      const order = await service.findOne('someId');

      expect(model.findById).toHaveBeenCalledWith('someId');
      expect(order).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne('nonexistentId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update the order', async () => {
      const updateOrderDto: UpdateOrderDto = { status: OrderStatus.SHIPPED };
      const updatedOrder = { ...mockOrder, status: OrderStatus.SHIPPED };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedOrder),
      } as any);
      mockPubSubService.publishMessage.mockResolvedValueOnce('messageId');

      const result = await service.update('someId', updateOrderDto);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'someId',
        updateOrderDto,
        { new: true },
      );
      expect(pubSubService.publishMessage).toHaveBeenCalledWith(
        TOPIC_NAME,
        expect.any(Object),
      );
      expect(result).toEqual(updatedOrder);
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.update('nonexistentId', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the order', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockOrder),
      } as any);

      await service.delete('someId');

      expect(model.findByIdAndDelete).toHaveBeenCalledWith('someId');
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.delete('nonexistentId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
