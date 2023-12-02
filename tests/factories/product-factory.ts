import { Product, ProductType, Topping } from '@prisma/client';
import { faker } from '@faker-js/faker';
import prisma from '../../src/database/database';

export async function createProduct(type: ProductType): Promise<Product> {
  const product: Product = await prisma.product.create({
    data: {
      name: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: faker.number.int({ max: 2147000000 }),
      type,
      image: faker.image.urlPicsumPhotos(),
    },
  });
  return product;
}

export async function createTopping(productId: number): Promise<Topping> {
  const topping: Topping = await prisma.topping.create({
    data: {
      name: faker.commerce.product(),
      price: faker.number.int({ max: 2147000000 }),
      productId,
      description: faker.person.firstName(),
      image: faker.image.urlPicsumPhotos(),
    },
  });
  return topping;
}

export async function createProductForOrder(orderId: number, productId: number) {
  const products = await prisma.productByOrder.create({
    data: {
      productId,
      orderId,
    },
  });

  return products;
}

export async function getProductByOrder(orderId: number) {
  return prisma.productByOrder.findFirst({
    where: { orderId },
  });
}
