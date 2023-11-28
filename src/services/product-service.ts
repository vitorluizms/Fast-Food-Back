import productRepository from '../repositories/product-repository';

async function get() {
  const products = await productRepository.get();
  return products;
}

const productService = { get };
export default productService;
