import { NextFunction, Request, Response } from 'express';
import Joi, { ObjectSchema } from 'joi';
import { invalidBodyError } from '@/errors/invalidBodyError';

function throwError(error: Joi.ValidationError) {
  const errorMessage = error.details.map(d => d.message).join(', ');
  throw invalidBodyError(errorMessage);
}

function validate(schema: ObjectSchema, type: 'body' | 'params') {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[type], {
      abortEarly: false,
    });
    if (!error) {
      next();
      return;
    }
    throwError(error);
  };
}

export function validateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, 'body');
}

export function validateParams<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, 'params');
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;
