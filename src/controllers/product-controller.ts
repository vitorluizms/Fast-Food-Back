import { Request, Response } from 'express';
import httpStatus from 'http-status';
import productService from '../services/product-service';

async function get(req: Request, res: Response) {
  const products = await productService.get();

  res.status(httpStatus.OK).send(products);
}

const productController = { get };
export default productController;
