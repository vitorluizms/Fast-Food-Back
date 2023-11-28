import { faker } from '@faker-js/faker';
import prisma from '../../src/database/database';

export function createOrderBody(body: OrderBody): OrderBody {
  return {
    amountPay: body.amountPay !== undefined ? body.amountPay : faker.number.int({ min: 1, max: 2147000000 }),
    client: body.client !== undefined ? body.client : faker.person.firstName(),
    products: [
      {
        productId:
          body.products[0].productId !== undefined ? body.products[0].productId : faker.number.int({ min: 1, max: 40 }),
      },
    ],
  };
}

export function createOrderBodyWithToppings(body: OrderBodyWithToppings): OrderBodyWithToppings {
  return {
    amountPay: body.amountPay !== undefined ? body.amountPay : faker.number.int({ min: 1, max: 2147000000 }),
    client: body.client !== undefined ? body.client : faker.person.firstName(),
    products: [
      {
        productId:
          body.products[0].productId !== undefined ? body.products[0].productId : faker.number.int({ min: 1, max: 40 }),
        toppings: body.products[0].toppings !== undefined ? body.products[0].toppings : faker.person.firstName(),
      },
    ],
  };
}

export async function getOrder() {
  const order = await prisma.order.findFirst({});
  return order;
}

export async function createOrder(isFinished?: boolean, delivered?: boolean) {
  const order = await prisma.order.create({
    data: {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      client: faker.person.firstName(),
      isFinished: isFinished !== undefined ? isFinished : false,
      delivered: delivered !== undefined ? delivered : false,
    },
  });

  return order;
}

type OrderBody = {
  amountPay?: number | string;
  client?: string | number;
  products?: [
    {
      productId: number | string;
    },
  ];
};

type OrderBodyWithToppings = {
  amountPay?: number;
  client?: string;
  products?: [
    {
      productId?: number;
      toppings?: string | number;
    },
  ];
};