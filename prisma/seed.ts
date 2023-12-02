import { ProductType } from '@prisma/client';
import prisma from '../src/database/database';

async function clearDatabase() {
  await prisma.productByOrder.deleteMany();
  await prisma.topping.deleteMany();
  await prisma.product.deleteMany();
  await prisma.order.deleteMany();
}

async function main() {
  await clearDatabase();
  const products: CreateProduct[] = [
    {
      name: 'Smash Supreme',
      description: 'Pão brioche, duplo smash burger, 2 fatias de cheddar, salada, picles e molho especial',
      image: 'https://i.imgur.com/lJ5dzOd.png',
      price: 2500,
      type: ProductType.Hamburger,
    },
    {
      name: 'Bacon Sunrise Burger',
      description:
        'Pão brioche, 1 burger artesanal 160g, 1 ovo, 2 fatias de bacon, 1 fatia de mussarela, salada, picles e molho especial',
      image: 'https://i.imgur.com/P7srUSD.png',
      price: 2600,
      type: ProductType.Hamburger,
    },
    {
      name: 'Cheddar Caramel Bliss',
      description: 'Pão brioche, duplo smash burger, 2 fatias de cheddar, picles, cebola caramelizada e molho especial',
      image: 'https://i.imgur.com/tBQwG31.png',
      price: 2700,
      type: ProductType.Hamburger,
    },
    {
      name: 'Supreme Mushroom',
      description:
        'Pão brioche, burger artesanal 200g, 1 fatia de mussarela, cogumelos shimeji refogados, alface roxa, cebola caramelizada, tomates confitados e molho especial',
      image: 'https://i.imgur.com/glx1JlD.png',
      price: 3000,
      type: ProductType.Hamburger,
    },
    {
      name: 'Batata frita artesanal',
      description: 'Porção de batata frita',
      image: 'https://i.imgur.com/aH8iFU2.png',
      price: 1200,
      type: ProductType.Accompaniment,
    },
    {
      name: 'Onion Rings',
      description: 'Porção de onion rings',
      image: 'https://i.imgur.com/3DVLqZ7.png',
      price: 1200,
      type: ProductType.Accompaniment,
    },
    {
      name: 'Milk shake de Oreo 500ml',
      description: 'Milk shake de oreo e ovomaltine',
      image: 'https://i.imgur.com/f2pyg15.png',
      price: 1600,
      type: ProductType.Drinks,
    },
    {
      name: 'Milk shake de ovomaltine 500ml',
      description: 'Milk shake de ovomaltine, calda de chocolate e granulado',
      image: 'https://i.imgur.com/Sj6H89A.png',
      price: 1600,
      type: ProductType.Drinks,
    },
    {
      name: 'Combo 1',
      description: 'Smash Supreme, Batata frita ou Onion rings e Milk Shake',
      image: 'https://i.imgur.com/lJ5dzOd.png',
      price: 5000,
      type: ProductType.Combo,
    },
    {
      name: 'Combo 2',
      description: 'Bacon Sunrise, Batata frita ou Onion rings e Milk Shake',
      image: 'https://i.imgur.com/P7srUSD.png',
      price: 5100,
      type: ProductType.Combo,
    },

    {
      name: 'Combo 3',
      description: 'Cheddar Caramel Bliss, Batata frita ou Onion rings e Milk Shake',
      image: 'https://i.imgur.com/tBQwG31.png',
      price: 5200,
      type: ProductType.Combo,
    },
    {
      name: 'Combo 4',
      description: 'Supreme Mushroom, Batata frita ou Onion rings e Milk Shake',
      image: 'https://i.imgur.com/glx1JlD.png',
      price: 5500,
      type: ProductType.Combo,
    },
    {
      name: 'Pudim',
      description: 'Pudim de leite',
      image: 'https://i.imgur.com/AhHfzfM.png',
      price: 500,
      type: ProductType.Dessert,
    },
    {
      name: 'Mousse de chocolate',
      description: 'Mousse de chocolate',
      image:
        'https://images.unsplash.com/photo-1590080875852-ba44f83ff2db?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      price: 600,
      type: ProductType.Dessert,
    },
    {
      name: 'Mousse de maracujá',
      description: 'Mousse de maracujá',
      image: 'https://i.imgur.com/hQpDHE5.png',
      price: 600,
      type: ProductType.Dessert,
    },
    {
      name: 'Brigadeiro',
      description: 'Unidade de Brigadeiro',
      image: 'https://i.imgur.com/BEw9gaP.png',
      price: 200,
      type: ProductType.Dessert,
    },
    {
      name: 'Lata de Refrigerante',
      description: 'Coca-cola, Guaraná ou Fanta 350ml',
      image: 'https://i.imgur.com/fNJoh2B.png',
      price: 500,
      type: ProductType.Drinks,
    },
  ];
  let burgersId: number[] = [];
  async function createProduct(element: CreateProduct) {
    const product = await prisma.product.create({
      data: element,
      select: { id: true },
    });

    if (element.type === 'Hamburger') {
      burgersId = [...burgersId, product.id];
    }
  }

  for (const element of products) {
    await createProduct(element);
  }

  const toppings = burgersId
    .map(element => {
      return [
        {
          name: 'Bacon',
          description: '10g',
          price: 200,
          image: 'https://i.imgur.com/ls272xU.png',
          productId: element,
        },
        {
          name: 'Ovo',
          description: 'Ovo frito',
          price: 100,
          image: 'https://i.imgur.com/q7nGLN1.png',
          productId: element,
        },
        {
          name: 'Cheddar',
          description: '10g',
          price: 100,
          image: 'https://i.imgur.com/70f6XqM.png',
          productId: element,
        },
      ];
    })
    .flat();

  await prisma.topping.createMany({ data: toppings });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

type CreateProduct = {
  name: string;
  description: string;
  image: string;
  price: number;
  type: ProductType;
};

type CreateTopping = {
  name: string;
  productId: number;
  image: string;
  price: number;
};
