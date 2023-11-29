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
}).messages({
  'any.required': 'O campo {#label} é obrigatório',
  'string.base': 'O campo {#label} deve ser uma string',
  'number.base': 'O campo {#label} deve ser um número',
  'number.integer': 'O campo {#label} deve ser um número inteiro',
  'number.greater': 'O campo {#label} deve ser um número inteiro maior que {#limit}',
  'number.max': 'O campo {#label} deve ser um número inteiro menor que {#limit}',
});

export const finishOrderSchema = Joi.object<FinishOrderSchema>({
  id: Joi.number().integer().greater(0).required(),
}).messages({
  'any.required': 'O campo {#label} é obrigatório',
  'number.base': 'O campo {#label} deve ser um número',
  'number.integer': 'O campo {#label} deve ser um número inteiro',
  'number.greater': 'O campo {#label} deve ser um número inteiro maior que {#limit}',
});
