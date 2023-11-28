import prisma from '../src/database/database';

export async function cleanDb() {
  await prisma.productByOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.topping.deleteMany();
  await prisma.product.deleteMany();
}
