import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

export type AppError = Error & {
  type: string;
};

export default function errorHandlingMiddleware(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  if (error.name === 'NotFoundError') {
    return res.status(httpStatus.NOT_FOUND).send('NotFound');
  }

  if (error.name === 'ConflictError') {
    return res.status(httpStatus.CONFLICT).send('Conflict');
  }

  if (error.name === 'InvalidData') {
    return res.status(httpStatus.BAD_REQUEST).send(error.message);
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR);
}
