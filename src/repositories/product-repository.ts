import prisma from '../database/database';

function get() {
  return prisma.product.findMany({
    include: { Topping: true },
  });
}

async function getCountOfProductsInArray(productsArray: Array<number>) {
  const count = await prisma.product.aggregate({
    where: { id: { in: productsArray } },
    _count: { id: true },
  });

  // eslint-disable-next-line no-underscore-dangle
  return { count: count._count.id };
}

const productRepository = { get, getCountOfProductsInArray };
export default productRepository;
