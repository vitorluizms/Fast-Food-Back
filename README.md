## 🍔 PDV - Fast Food API

![GitHub repo size](https://img.shields.io/github/repo-size/vitorluizms/Fast-Food-Devio-Back?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/vitorluizms/Fast-Food-Devio-Back?style=for-the-badge)

## 🌐 Deploy

O deploy, do banco e da API, ambos foram hospedados, no Render.

URL da API: `https://devio-fast-food-api.onrender.com`

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Node.js: v18.16.1 (Utilizado no desenvolvimento);
- NPM: v9.5.1 (Utilizado no desenvolvimento);
- Postgres: v16.1 (Utilizado no desenvolvimento);

## 🔧 Tecnologias

Para a construção do projeto foi utilizado as seguintes tecnologias:

- TypeScript: v5.3.2;
- Node: v18.16.1;
- Express (Framework de Node.js): v4.18.2;
- Prisma (ORM): v5.6.0;
- PostgreSQL (Banco de dados);
- Jest (Criação de testes): v29.7.0;
- Supertest (Simulador de solicitações HTTP): v6.3.3;
- GitHub (versionamento de código);
- Joi (validação de campos): v17.11.0;
- Dotenv/ Dotenv-cli (Carregar variáveis de ambiente): v16.3.1 e 7.3.0;
- Nodemon (Reinicialização automática do servidor): v3.0.1.

## 📏Padronização

Neste projeto foi utilizado:

- ESLint para padronizar o código e manter consistência,
- Prettier para autoformatação do código
- Husky para validar e padronizar os commits;

## 🚀 Instalando Fast Food API

Para instalar o Fast Food API, siga estas etapas:

1. Clone o repositório: `git clone https://github.com/vitorluizms/Fast-Food-Devio-Back`;
2. Acesse o diretório do projeto: `cd Fast-Food-Devio-Back`;
3. Instale as dependências: `npm install` ou `npm i`.

## 🗄️ Banco de Dados

1. Certifique-se de ter o PostgreSQL instalado na máquina;
2. Para rodar o projeto em desenvolvimento, copie o arquivo `.env.example`, crie um novo com nome `.env.development` e configure a variável de ambiente relacionada ao banco de dados: `DATABASE_URL`, conforme exemplificado no `.env.example`;
3. Caso utilize o comando `npm run start`, deverá criar o arquivo apenas `.env` ao invés de `.env.development`.

## 🔶 Prisma

Para criar o banco e as tabelas:

1. Caso vá utilizar o comando de desenvolvimento `npm run dev`, execute as migrações do prisma com o comando: `npm run migration:dev`;
2. Caso prefira utilizar o comando de start `npm run start`, execute as migrações do Prisma: `npx prisma migrate deploy`;
3. Caso queira rodar os testes, configure o arquivo `.env.test`, e execute as migrações do prisma com: `npm run test:migration:run`.

## ☕ Usando Fast Food API

Para usar, siga estas etapas:

1. Desenvolvimento: `npm run dev`
2. Início simples: `npm run start`

## 🧑‍💻 Testes

Para rodas os testes:

1. Copie o arquivo `.env.example` e crie um arquivo `.env.test` configurando a variável de ambiente `DATABASE_URL` para testes, importante que o valor da variável `DATABASE_URL` seja diferente da de desenvolvimento;
2. Gere as migrações para a tabela de testes com `npm run test:migration:run`;
3. Rode os testes com `npm run test`, caso queira ver testes específicos, use `npm run test <nome do teste>`, pode ser `order` ou `product`.

## 📞 Contatos

linkedin: `https://www.linkedin.com/in/vitorluizmartins/`
gmail: `vitor.luiz.eer@gmail.com`
