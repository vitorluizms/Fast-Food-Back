import httpStatus from 'http-status';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { ProductType } from '@prisma/client';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { cleanDb } from '../helpers';
import { createOrder, createOrderBody, createOrderBodyWithToppings, getOrder } from '../factories/order-factory';
import { createProduct, createProductForOrder, getProductByOrder } from '../factories/product-factory';
import app from '../../src/app';

dayjs.extend(localizedFormat);

const server = supertest(app);

beforeEach(async () => {
  await cleanDb();
});

describe('POST /orders', () => {
  it('should return status 400 if amountPay was not sent', async () => {
    const body = {
      client: faker.person.firstName(),
      products: [
        {
          productId: faker.number.int({ min: 1, max: 40 }),
          toppings: [faker.number.int({ min: 1, max: 40 }), faker.number.int({ min: 1, max: 40 })],
        },
      ],
    };

    const response = await server.post('/orders').send(body);
    console.log(response.text);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if client was not sent', async () => {
    const body = {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      products: [
        {
          productId: faker.number.int({ min: 1, max: 40 }),
          toppings: [faker.number.int({ min: 1, max: 40 }), faker.number.int({ min: 1, max: 40 })],
        },
      ],
    };

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if products array was not sent', async () => {
    const body = {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      client: faker.person.firstName(),
    };

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if productId at products array was not sent', async () => {
    const body = {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      client: faker.person.firstName(),
      products: [
        {
          toppings: [faker.number.int({ min: 1, max: 40 }), faker.number.int({ min: 1, max: 40 })],
        },
      ],
    };

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if amountPay sent is not a number', async () => {
    const body = createOrderBody({ amountPay: faker.person.firstName() });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if amountPay sent is not an integer', async () => {
    const body = createOrderBody({ amountPay: faker.number.float({ max: 2147000000 }) });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if amountPay sent is not an integer greater than 0', async () => {
    const body = createOrderBody({ amountPay: faker.number.int({ min: -10, max: 0 }) });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if client sent is not a string', async () => {
    const body = createOrderBody({ client: faker.number.int({ max: 2147000000 }) });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if products sent is not an array', async () => {
    const body = {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      client: faker.person.firstName(),
      products: faker.number.int({ max: 2147000000 }),
    };

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if productId sent is not a number', async () => {
    const body = createOrderBody({ products: [{ productId: faker.person.firstName() }] });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if productId sent is not an integer', async () => {
    const body = createOrderBody({ products: [{ productId: faker.number.float() }] });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if productId sent is not an integer greater than 0', async () => {
    const body = createOrderBody({ products: [{ productId: faker.number.int({ min: -10, max: 0 }) }] });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if toppings sent is not a string', async () => {
    const body = createOrderBodyWithToppings({ products: [{ toppings: faker.number.int() }] });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('When given body is valid', () => {
    it('should return status 404 if a productId sent does not exists at database', async () => {
      const body = createOrderBodyWithToppings({});

      const response = await server.post('/orders').send(body);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return status 201, create the order and products of the order and return order data', async () => {
      const product = await createProduct(ProductType.Hamburger);
      const body = createOrderBodyWithToppings({
        products: [{ productId: product.id, toppings: faker.person.firstName() }],
      });

      const response = await server.post('/orders').send(body);
      const order = await getOrder();
      const productByOrder = await getProductByOrder(order.id);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      });
      expect(productByOrder).toEqual({
        id: expect.any(Number),
        observation: null,
        productId: product.id,
        orderId: order.id,
        quantity: 1,
        toppings: body.products[0].toppings,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});

describe('PATCH /orders/:id/finish', () => {
  it('should return status 400 if orderId sent is not a number', async () => {
    const response = await server.patch(`/orders/${faker.person.firstName()}/finish`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if orderId sent is not an integer', async () => {
    const response = await server.patch(`/orders/${faker.number.float()}/finish`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if orderId sent is not greater than 0', async () => {
    const response = await server.patch(`/orders/${faker.number.int({ min: -10, max: 0 })}/finish`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 404 if orderId sent does not exists at database', async () => {
    const response = await server.patch(`/orders/${faker.number.int({ min: 1, max: 40 })}/finish`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return status 409 if orderId sent is already finished', async () => {
    const order = await createOrder(true);

    const response = await server.patch(`/orders/${order.id}/finish`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should return status 200, update isFinished to true and return order and products of the order updated', async () => {
    const product = await createProduct(ProductType.Hamburger);
    const order = await createOrder();
    await createProductForOrder(order.id, product.id);

    const response = await server.patch(`/orders/${order.id}/finish`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      id: order.id,
      amountPay: order.amountPay,
      client: order.client,
      isFinished: true,
      delivered: false,
      createdAt: order.createdAt.toISOString(),
      updatedAt: expect.any(String),
    });
  });
});

describe('GET /orders', () => {
  it('should return status 200 and an empty array if there is no order at the database', async () => {
    const response = await server.get(`/orders`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual([]);
  });

  it('should return status 200 and and an array with order data filtered by date', async () => {
    const product = await createProduct(ProductType.Hamburger);
    const order = await createOrder();
    await createOrder(undefined, true);
    const productOrder = await createProductForOrder(order.id, product.id);

    const response = await server.get(`/orders`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual([
      {
        id: order.id,
        client: order.client,
        amountPay: order.amountPay,
        isFinished: order.isFinished,
        delivered: false,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        products: [
          {
            observation: productOrder.observation,
            quantity: productOrder.quantity,
            toppings: productOrder.toppings,
            product: {
              name: product.name,
              image: product.image,
            },
          },
        ],
      },
    ]);
  });
});

describe('PATCH /orders/:id/delivered', () => {
  it('should return status 400 if orderId sent is not a number', async () => {
    const response = await server.patch(`/orders/${faker.person.firstName()}/delivered`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if orderId sent is not an integer', async () => {
    const response = await server.patch(`/orders/${faker.number.float()}/delivered`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if orderId sent is not greater than 0', async () => {
    const response = await server.patch(`/orders/${faker.number.int({ min: -10, max: 0 })}/delivered`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 404 if orderId sent does not exists at the database', async () => {
    const response = await server.patch(`/orders/${faker.number.int({ min: 1, max: 40 })}/delivered`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return status 409 if order is not finished', async () => {
    const order = await createOrder();
    const response = await server.patch(`/orders/${order.id}/delivered`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should return status 409 if order is already delivered', async () => {
    const order = await createOrder(undefined, true);
    const response = await server.patch(`/orders/${order.id}/delivered`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should return status 200, update order to delivered and return order data updated', async () => {
    const product = await createProduct(ProductType.Hamburger);
    const order = await createOrder(true);
    await createOrder(undefined, true);
    await createProductForOrder(order.id, product.id);

    const response = await server.patch(`/orders/${order.id}/delivered`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      id: order.id,
      client: order.client,
      amountPay: order.amountPay,
      isFinished: order.isFinished,
      delivered: true,
      createdAt: order.createdAt.toISOString(),
      updatedAt: expect.any(String),
    });
  });
});
