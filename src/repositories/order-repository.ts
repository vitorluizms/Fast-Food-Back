import { Order } from '@prisma/client';
import prisma from '@/database/database';
import { CreateOrder } from '@/protocols';

async function create(body: CreateOrder) {
  let order: Order;
  await prisma.$transaction(async () => {
    order = await prisma.order.create({
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
        quantity: element.quantity,
      })),
    });
  });

  return order;
}

const orderRepository = { create };
export default orderRepository;
