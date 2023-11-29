import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Order } from '@prisma/client';
import { CreateOrder } from '@/protocols';
import orderService from '@/services/order-service';

async function create(req: Request, res: Response) {
  const body = req.body as CreateOrder;
  const order = await orderService.create(body);

  res.status(httpStatus.CREATED).send(order);
}

async function finishOrder(req: Request, res: Response) {
  const { id } = req.params;
  const orderFinished = await orderService.finishOrder(Number(id));

  res.status(httpStatus.OK).send(orderFinished);
}
async function get(req: Request, res: Response) {
  const orders: Order[] = await orderService.get();

  res.status(httpStatus.OK).send(orders);
}

const orderController = { create, finishOrder, get };
export default orderController;
