import { Order } from '@prisma/client';
import { conflictError } from '@/errors/conflictError';
import { notFoundError } from '@/errors/notFoundError';
import { CreateOrder, ProductsArray } from '@/protocols';
import orderRepository from '@/repositories/order-repository';
import productRepository from '@/repositories/product-repository';

function filterRepeatedElements(products: ProductsArray) {
  const uniqueIds = {};
  return products.filter(element => {
    if (uniqueIds[element.productId] === undefined) {
      uniqueIds[element.productId] = true;
      return true;
    }
    return false;
  });
}

async function validateProductsId(products: ProductsArray): Promise<void> {
  const filteredArray = filterRepeatedElements(products);

  const arrayOfIds: number[] = products.map(element => element.productId);

  const count: { count: number } = await productRepository.getCountOfProductsInArray(arrayOfIds);
  if (count.count !== filteredArray.length) {
    throw notFoundError('ID(s) de produto(s) inválido(s)');
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
  if (order.delivered === true) throw conflictError('O pedido já foi entregue!');
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

async function getLastOrder() {
  const order = await orderRepository.getLastOrder();

  return order;
}

async function deliverOrder(id: number): Promise<Order> {
  await validateOrderToDeliver(id);
  const orderDelivered = await orderRepository.deliverOrder(id);

  return orderDelivered;
}

async function validateOrderToDelete(id: number) {
  const order = await orderRepository.getOrderById(id);

  if (!order) throw notFoundError('Pedido não encontrado!');
  if (order.delivered === true) throw conflictError('O pedido já foi entregue!');
}

async function deleteOrder(id: number): Promise<void> {
  await validateOrderToDelete(id);

  await orderRepository.deleteOrder(id);
}

const orderService = { create, finishOrder, get, deliverOrder, deleteOrder, getLastOrder };
export default orderService;
