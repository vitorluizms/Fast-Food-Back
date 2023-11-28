import httpStatus from 'http-status';
import supertest from 'supertest';
import app from '@/app';

const server = supertest(app);

describe('POST /orders', () => {
  it('should return status 400 if amountPay was not sent', async () => {
    const body = {
      client: '',
      products: [
        {
          productId: 1,
          toppings: [1, 2],
        },
      ],
    };

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return status 400 if client was not sent', async () => {
    const body = {
      client: 1,
      products: [
        {
          productId: 1,
          toppings: [1, 2],
        },
      ],
    };

    const response = await server.post('/orders').send(body);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
});
