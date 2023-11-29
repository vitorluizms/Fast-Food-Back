import { Router } from 'express';
import orderController from '@/controllers/order-controller';
import { validateBody } from '@/middlewares/validation-middleware';
import { orderSchema } from '@/schemas/order-schemas';

const orderRouter = Router();

orderRouter.post('/', validateBody(orderSchema), orderController.create);

export default orderRouter;
