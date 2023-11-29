import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CreateOrder } from '@/protocols';
import orderService from '@/services/order-service';

async function create(req: Request, res: Response) {
  const body = req.body as CreateOrder;
  const order = await orderService.create(body);

  res.status(httpStatus.CREATED).send(order);
}

const orderController = { create };
export default orderController;
