import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './order.schema';
import { HttpException } from '@nestjs/common';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

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
    save: jest.fn(),
  };

  const mockOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = {
        sellerId: 'seller1',
        customerId: 'customer1',
        productId: 'product1',
        quantity: 2,
        price: 50,
      };
      jest
        .spyOn(service, 'create')
        .mockResolvedValue(mockOrder as unknown as Order);

      const result = await controller.createOrder(createOrderDto);

      expect(result).toEqual(mockOrder);
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
    });

    it('should throw an exception if order creation fails', async () => {
      const createOrderDto: CreateOrderDto = {
        sellerId: 'seller1',
        customerId: 'customer1',
        productId: 'product1',
        quantity: 2,
        price: 50,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Creation failed'));

      await expect(controller.createOrder(createOrderDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('listOrders', () => {
    it('should return an array of orders', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue([mockOrder as unknown as Order]);

      const result = await controller.listOrders();

      expect(result).toEqual([mockOrder]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return orders for a specific seller', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue([mockOrder as unknown as Order]);

      const result = await controller.listOrders('seller1');

      expect(result).toEqual([mockOrder]);
      expect(service.findAll).toHaveBeenCalledWith('seller1');
    });

    it('should throw an exception if order retrieval fails', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValue(new Error('Retrieval failed'));

      await expect(controller.listOrders()).rejects.toThrow(HttpException);
    });
  });

  describe('getOrder', () => {
    it('should return a single order', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockOrder as unknown as Order);

      const result = await controller.getOrder('1');

      expect(result).toEqual(mockOrder);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.getOrder('nonexistent')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an exception if order retrieval fails', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Retrieval failed'));

      await expect(controller.getOrder('1')).rejects.toThrow(HttpException);
    });
  });

  describe('updateOrder', () => {
    it('should update an order', async () => {
      const updateOrderDto: UpdateOrderDto = { status: OrderStatus.SHIPPED };
      const updatedOrder = { ...mockOrder, status: 'Shipped' };

      jest
        .spyOn(service, 'update')
        .mockResolvedValue(updatedOrder as unknown as Order);

      const result = await controller.updateOrder('1', updateOrderDto);

      expect(result).toEqual(updatedOrder);
      expect(service.update).toHaveBeenCalledWith('1', updateOrderDto);
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.updateOrder('nonexistent', {})).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an exception if order update fails', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(controller.updateOrder('1', {})).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await expect(controller.deleteOrder('1')).resolves.not.toThrow();
      expect(service.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an exception if order deletion fails', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.deleteOrder('1')).rejects.toThrow(HttpException);
    });
  });
});
