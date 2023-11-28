import { Router } from 'express';
import productController from '../controllers/product-controller';

const productRouter = Router();

productRouter.get('/', productController.get);

export default productRouter;
