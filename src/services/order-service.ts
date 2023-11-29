import { Order } from '@prisma/client';
import { conflictError } from '@/errors/conflictError';
import { notFoundError } from '@/errors/notFoundError';
import { CreateOrder, ProductsArray } from '@/protocols';
import orderRepository from '@/repositories/order-repository';
import productRepository from '@/repositories/product-repository';

async function validateProductsId(products: ProductsArray): Promise<void> {
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

async function create(body: CreateOrder): Promise<Order> {
  await validateProductsId(body.products);

  const order = await orderRepository.create(body);
  return order;
}

async function validateOrder(id: number): Promise<void> {
  const order = await orderRepository.getOrderById(id);

  if (!order) throw notFoundError('Pedido não encontrado!');
  if (order.isFinished === true) throw conflictError('Pedido já está encerrado!');
}

async function validateOrderToDeliver(id: number): Promise<void> {
  const order = await orderRepository.getOrderById(id);

  if (!order) throw notFoundError('Pedido não encontrado!');
  if (order.isFinished === false) throw conflictError('O pedido não está pronto!');
}

async function finishOrder(id: number): Promise<Order> {
  await validateOrder(id);
  const orderFinished = await orderRepository.finishOrder(id);

  return orderFinished;
}

async function get() {
  const orders: Order[] = await orderRepository.getAllOrders();

  return orders;
}

async function deliverOrder(id: number): Promise<Order> {
  await validateOrderToDeliver(id);
  const orderDelivered = await orderRepository.deliverOrder(id);

  return orderDelivered;
}

const orderService = { create, finishOrder, get, deliverOrder };
export default orderService;
