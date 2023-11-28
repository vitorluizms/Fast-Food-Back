export type CreateOrder = {
  client: string;
  amountPay: number;
  products: [
    {
      productId: number;
      toppings: string;
    },
  ];
};
