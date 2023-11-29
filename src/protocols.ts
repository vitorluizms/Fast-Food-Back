export type CreateOrder = {
  client: string;
  amountPay: number;
  products: [
    {
      productId: number;
      toppings?: string;
      quantity?: number;
      description?: string;
    },
  ];
};

export type ProductsArray = [
  {
    productId: number;
    toppings?: string;
    quantity?: number;
    description?: string;
  },
];

export type ApplicationError = {
  name: string;
  message: string;
};

export type FinishOrderSchema = {
  id: number;
};
