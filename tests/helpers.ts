import prisma from '@/database/database';

export async function cleanDb() {
  const array = [1, 2, 3, 4, 5];
  prisma.order.create({
    data: {
      amountPay: 1000,
      client: 'eu',
      ProductAndOrder: {
        createMany: {
          data: array.map(element => ({
            productId: element,
            orderId: 1,
            quantity: 1,
          })),
        },
      },
    },
  });
}
