import prisma from '@/database/database';

export async function cleanDb() {
  const array = [
    {
      productId: 1,
      toppings: [1, 2, 3],
    },
  ];
  prisma.order.create({
    data: {
      amountPay: 1000,
      client: 'eu',
      ProductAndOrder: {
        createMany: {
          data: array.map(element => ({
            productId: element.productId,
            orderId: 1,
            quantity: 1,
            toppings: 'asdas',
          })),
        },
      },
    },
  });
}
