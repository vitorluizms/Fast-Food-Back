import { Product } from '@prisma/client';
import productRepository from '../repositories/product-repository';

async function get(): Promise<Product[]> {
  const products = await productRepository.get();
  return products;
}

const productService = { get };
export default productService;
