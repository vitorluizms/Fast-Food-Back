import { Product, ProductType, Topping } from '@prisma/client';
import { faker } from '@faker-js/faker';
import prisma from '@/database/database';

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
      image: faker.image.urlPicsumPhotos(),
    },
  });
  return topping;
}
