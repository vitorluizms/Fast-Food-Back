import Joi from 'joi';

export const orderSchema = Joi.object({
  client: Joi.string().required(),
});
