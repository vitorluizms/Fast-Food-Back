import prisma from '@/database/database';
import { CreateOrder } from '@/protocols';

async function create(body: CreateOrder) {
  await prisma.$transaction(async () => {
    const order = await prisma.order.create({
      data: {
        client: body.client,
        amountPay: body.amountPay,
      },
    });

    await prisma.productByOrder.createMany({
      data: body.products.map(element => ({
        productId: element.productId,
        toppings: element.toppings,
        orderId: order.id,
      })),
    });
  });
}

const orderRepository = { create };
export default orderRepository;
