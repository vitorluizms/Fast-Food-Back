import httpStatus from 'http-status';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { createOrderBody, createOrderBodyWithToppings, getOrder } from 'tests/factories/order-factory';
import { createProduct } from 'tests/factories/product-factory';
import { ProductType } from '@prisma/client';
import app from '@/app';

const server = supertest(app);

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
      const body = createOrderBodyWithToppings({ products: [{ productId: product.id }] });

      const response = await server.post('/orders').send(body);
      const order = await getOrder();

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual(order);
    });
  });
});
