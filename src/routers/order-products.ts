import { Router } from 'express';
import orderController from '@/controllers/order-controller';
import { validateBody, validateParams } from '@/middlewares/validation-middleware';
import { finishOrderSchema, orderSchema } from '@/schemas/order-schemas';

const orderRouter = Router();

orderRouter.post('/', validateBody(orderSchema), orderController.create);
orderRouter.get('/', orderController.get);
orderRouter.patch('/:id/finish', validateParams(finishOrderSchema), orderController.finishOrder);
orderRouter.patch('/:id/delivered', validateParams(finishOrderSchema), orderController.deliverOrder);
orderRouter.delete('/:id', validateParams(finishOrderSchema), orderController.deleteOrder);

export default orderRouter;
