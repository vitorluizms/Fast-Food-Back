import prisma from '../database/database';

function get() {
  return prisma.product.findMany({
    include: { Topping: true },
  });
}

const productRepository = { get };
export default productRepository;
