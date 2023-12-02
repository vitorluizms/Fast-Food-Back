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
          toppings: faker.person.firstName(),
        },
      ],
    };

    const response = await server.post('/orders').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "amountPay" é obrigatório');
  });

  it('should return status 400 if client was not sent', async () => {
    const body = {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      products: [
        {
          productId: faker.number.int({ min: 1, max: 40 }),
          toppings: faker.person.firstName(),
        },
      ],
    };

    const response = await server.post('/orders').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "client" é obrigatório');
  });

  it('should return status 400 if products array was not sent', async () => {
    const body = {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      client: faker.person.firstName(),
    };

    const response = await server.post('/orders').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products" é obrigatório');
  });

  it('should return status 400 if productId at products array was not sent', async () => {
    const body = {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      client: faker.person.firstName(),
      products: [
        {
          toppings: faker.person.firstName(),
        },
      ],
    };

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].productId" é obrigatório');
  });

  it('should return status 400 if amountPay sent is not a number', async () => {
    const body = createOrderBody({ amountPay: faker.person.firstName() });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "amountPay" deve ser um número');
  });

  it('should return status 400 if amountPay sent is not an integer', async () => {
    const body = createOrderBody({ amountPay: faker.number.float({ max: 2147000000 }) });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "amountPay" deve ser um número inteiro');
  });

  it('should return status 400 if amountPay sent is not an integer greater than 0', async () => {
    const body = createOrderBody({ amountPay: faker.number.int({ min: -10, max: 0 }) });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "amountPay" deve ser um número inteiro maior que 0');
  });

  it('should return status 400 if client sent is not a string', async () => {
    const body = createOrderBody({ client: faker.number.int({ max: 2147000000 }) });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "client" deve ser uma string');
  });

  it('should return status 400 if products sent is not an array', async () => {
    const body = {
      amountPay: faker.number.int({ min: 1, max: 2147000000 }),
      client: faker.person.firstName(),
      products: faker.number.int({ max: 2147000000 }),
    };

    const response = await server.post('/orders').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products" deve ser um array');
  });

  it('should return status 400 if productId sent is not a number', async () => {
    const body = createOrderBody({ products: [{ productId: faker.person.firstName() }] });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].productId" deve ser um número');
  });

  it('should return status 400 if productId sent is not an integer', async () => {
    const body = createOrderBody({ products: [{ productId: faker.number.float() }] });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].productId" deve ser um número inteiro');
  });

  it('should return status 400 if productId sent is not an integer greater than 0', async () => {
    const body = createOrderBody({ products: [{ productId: faker.number.int({ min: -10, max: 0 }) }] });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].productId" deve ser um número inteiro maior que 0');
  });

  it('should return status 400 if toppings sent is not a string', async () => {
    const body = createOrderBodyWithToppings({
      products: [{ productId: faker.number.int(), toppings: faker.number.int() }],
    });

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].toppings" deve ser uma string');
  });

  it('should return status 400 if observation sent is not a string', async () => {
    const body = createOrderBodyWithToppings({
      products: [
        {
          productId: faker.number.int(),
          toppings: faker.commerce.productDescription(),
          observation: faker.number.int(),
        },
      ],
    });

    const response = await server.post('/orders').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].observation" deve ser uma string');
  });

  it('should return status 400 if quantity sent is not a number', async () => {
    const body = createOrderBodyWithToppings({
      products: [
        {
          productId: faker.number.int(),
          toppings: faker.commerce.productDescription(),
          observation: faker.commerce.productDescription(),
          quantity: faker.person.firstName(),
        },
      ],
    });

    const response = await server.post('/orders').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].quantity" deve ser um número');
  });

  it('should return status 400 if quantity sent is not a integer', async () => {
    const body = createOrderBodyWithToppings({
      products: [
        {
          productId: faker.number.int(),
          toppings: faker.commerce.productDescription(),
          observation: faker.commerce.productDescription(),
          quantity: faker.number.float(),
        },
      ],
    });

    const response = await server.post('/orders').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].quantity" deve ser um número inteiro');
  });

  it('should return status 400 if quantity sent is not a integer', async () => {
    const body = createOrderBodyWithToppings({
      products: [
        {
          productId: faker.number.int(),
          toppings: faker.commerce.productDescription(),
          observation: faker.commerce.productDescription(),
          quantity: faker.number.int({ min: -1, max: 0 }),
        },
      ],
    });

    const response = await server.post('/orders').send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "products[0].quantity" deve ser um número inteiro maior que 0');
  });

  describe('When given body is valid', () => {
    it('should return status 404 if a productId sent does not exists at database', async () => {
      const body = createOrderBodyWithToppings();

      const response = await server.post('/orders').send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.text).toEqual('ID(s) de produto(s) inválido(s)');
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
    expect(response.text).toEqual('O campo "id" deve ser um número');
  });

  it('should return status 400 if orderId sent is not an integer', async () => {
    const response = await server.patch(`/orders/${faker.number.float()}/finish`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "id" deve ser um número inteiro');
  });

  it('should return status 400 if orderId sent is not greater than 0', async () => {
    const response = await server.patch(`/orders/${faker.number.int({ min: -10, max: 0 })}/finish`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "id" deve ser um número inteiro maior que 0');
  });

  it('should return status 404 if orderId sent does not exists at database', async () => {
    const response = await server.patch(`/orders/${faker.number.int({ min: 1, max: 40 })}/finish`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.text).toEqual('Pedido não encontrado!');
  });

  it('should return status 409 if orderId sent is already finished', async () => {
    const order = await createOrder(true);

    const response = await server.patch(`/orders/${order.id}/finish`);

    expect(response.status).toBe(httpStatus.CONFLICT);
    expect(response.text).toEqual('Pedido já está encerrado!');
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

  it('should return the last order registered if query string "last" was sent', async () => {
    await createProduct(ProductType.Hamburger);
    const order = await createOrder();
    await createOrder(undefined, true);

    const response = await server.get(`/orders?last=true`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
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
    expect(response.text).toEqual('Pedido não encontrado!');
  });

  it('should return status 409 if order is not finished', async () => {
    const order = await createOrder();
    const response = await server.patch(`/orders/${order.id}/delivered`);

    expect(response.status).toBe(httpStatus.CONFLICT);
    expect(response.text).toEqual('O pedido não está pronto!');
  });

  it('should return status 409 if order is already delivered', async () => {
    const order = await createOrder(true, true);
    const response = await server.patch(`/orders/${order.id}/delivered`);

    expect(response.status).toBe(httpStatus.CONFLICT);
    expect(response.text).toEqual('O pedido já foi entregue!');
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

describe('DELETE /orders/:id', () => {
  it('should return status 400 if orderId sent is not a number', async () => {
    const response = await server.patch(`/orders/${faker.person.firstName()}/delivered`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "id" deve ser um número');
  });

  it('should return status 400 if orderId sent is not an integer', async () => {
    const response = await server.patch(`/orders/${faker.number.float()}/delivered`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "id" deve ser um número inteiro');
  });

  it('should return status 400 if orderId sent is not greater than 0', async () => {
    const response = await server.patch(`/orders/${faker.number.int({ min: -10, max: 0 })}/delivered`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.text).toEqual('O campo "id" deve ser um número inteiro maior que 0');
  });

  it('should return status 404 if orderId does not exists', async () => {
    const response = await server.delete('/orders/1');

    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.text).toEqual('Pedido não encontrado!');
  });

  it('should return status 409 if order was delivered', async () => {
    const order = await createOrder(true, true);

    const response = await server.delete(`/orders/${order.id}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
    expect(response.text).toEqual('O pedido já foi entregue!');
  });

  it('should return status 200 and delete the order', async () => {
    const order = await createOrder(true);

    const response = await server.delete(`/orders/${order.id}`);

    expect(response.status).toBe(httpStatus.OK);
  });
});
