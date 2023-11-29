import { conflictError } from '@/errors/conflictError';
import { notFoundError } from '@/errors/notFoundError';
import { CreateOrder, ProductsArray } from '@/protocols';
import orderRepository from '@/repositories/order-repository';
import productRepository from '@/repositories/product-repository';

async function validateProductsId(products: ProductsArray) {
  const uniqueIds = {};
  const filteredArray = products.filter(element => {
    if (uniqueIds[element.productId] === undefined) {
      uniqueIds[element.productId] = true;
      return true;
    }
    return false;
  });

  const arrayOfIds: number[] = products.map(element => element.productId);
  const count: { count: number } = await productRepository.getCountOfProductsInArray(arrayOfIds);
  if (count.count !== filteredArray.length) {
    throw notFoundError('Ids de produto inválido!');
  }
}

async function create(body: CreateOrder) {
  await validateProductsId(body.products);

  const order = await orderRepository.create(body);
  return order;
}

async function validateOrder(id: number) {
  const order = await orderRepository.getOrderById(id);

  if (!order) throw notFoundError('Pedido não encontrado!');
  if (order.isFinished === true) throw conflictError('Pedido já está encerrado!');
}

async function finishOrder(id: number) {
  await validateOrder(id);
  const orderFinished = await orderRepository.finishOrder(id);

  return orderFinished;
}

const orderService = { create, finishOrder };
export default orderService;
