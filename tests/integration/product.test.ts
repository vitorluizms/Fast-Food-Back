import supertest from 'supertest';
import { createProduct, createTopping } from 'tests/factories/product-factory';
import { Product, ProductType, Topping } from '@prisma/client';
import app from '@/app';

const server = supertest(app);

describe('GET /products', () => {
  it('should return status 200 and an empty array if there is no products registered', async () => {
    const response = await server.get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return status 200 and all products data with their toppings', async () => {
    const product1: Product = await createProduct(ProductType.Hamburger);
    const product2: Product = await createProduct(ProductType.Accompaniment);
    const topping1: Topping = await createTopping(product1.id);
    const topping2: Topping = await createTopping(product1.id);
    const topping3: Topping = await createTopping(product2.id);

    const product1WithToppings: ProductWithToppings = {
      id: product1.id,
      name: product1.name,
      description: product1.description,
      image: product1.image,
      price: product1.price,
      type: product1.type,
      createdAt: product1.createdAt,
      updatedAt: product1.updatedAt,
      toppings: [
        {
          id: topping1.id,
          name: topping1.name,
          productId: product1.id,
          price: topping1.price,
          image: topping1.image,
          createdAt: topping1.createdAt,
          updatedAt: topping1.updatedAt,
        },
        {
          id: topping2.id,
          name: topping2.name,
          productId: product2.id,
          price: topping2.price,
          image: topping2.image,
          createdAt: topping2.createdAt,
          updatedAt: topping2.updatedAt,
        },
      ],
    };
    const product2WithToppings: ProductWithToppings = {
      id: product2.id,
      name: product2.name,
      description: product2.description,
      image: product2.image,
      price: product2.price,
      type: product2.type,
      createdAt: product2.createdAt,
      updatedAt: product2.updatedAt,
      toppings: [
        {
          id: topping3.id,
          name: topping3.name,
          productId: product1.id,
          price: topping3.price,
          image: topping3.image,
          createdAt: topping3.createdAt,
          updatedAt: topping3.updatedAt,
        },
      ],
    };

    const response = await server.get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([product1WithToppings, product2WithToppings]);
  });
});

type ProductWithToppings = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  type: ProductType;
  createdAt: Date;
  updatedAt: Date;
  toppings: {
    id: number;
    name: string;
    productId: number;
    image: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};
