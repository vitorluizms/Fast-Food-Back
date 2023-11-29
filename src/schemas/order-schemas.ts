import Joi from 'joi';
import { CreateOrder, FinishOrderSchema } from '@/protocols';

export const orderSchema = Joi.object<CreateOrder>({
  client: Joi.string().required(),
  amountPay: Joi.number().integer().greater(0).max(2147000000).required(),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().greater(0).required(),
        toppings: Joi.string().optional(),
        observation: Joi.string().optional(),
        quantity: Joi.number().integer().greater(0).optional(),
      }),
    )
    .required(),
});

export const finishOrderSchema = Joi.object<FinishOrderSchema>({
  id: Joi.number().integer().greater(0).required(),
});
