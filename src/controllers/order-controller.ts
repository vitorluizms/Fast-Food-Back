import { Request, Response } from 'express';
import httpStatus from 'http-status';
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

const orderController = { create, finishOrder };
export default orderController;
