import { Router } from 'express';
import productRouter from './products-router';
import orderRouter from './order-products';

const router = Router();

router.use('/products', productRouter);
router.use('/orders', orderRouter);

export default router;
