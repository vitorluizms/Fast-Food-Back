import { Order } from '@prisma/client';
import prisma from '@/database/database';
import { CreateOrder } from '@/protocols';

async function create(body: CreateOrder): Promise<Order> {
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

async function finishOrder(id: number): Promise<Order> {
  const finishedOrder = await prisma.order.update({
    where: { id },
    data: { isFinished: true },
  });

  return finishedOrder;
}

async function getOrderById(id: number): Promise<Order> {
  const order = await prisma.order.findFirst({
    where: { id },
  });

  return order;
}

async function getAllOrders() {
  const orders = await prisma.order.findMany({
    where: { delivered: false },
    include: {
      products: {
        select: {
          observation: true,
          quantity: true,
          toppings: true,
          product: { select: { name: true, image: true } },
        },
      },
    },
  });

  return orders;
}

async function deliverOrder(id: number): Promise<Order> {
  const orderDelivered = await prisma.order.update({
    where: { id },
    data: {
      delivered: true,
    },
  });

  return orderDelivered;
}

const orderRepository = { create, finishOrder, getOrderById, getAllOrders, deliverOrder };
export default orderRepository;
