/*
  Warnings:

  - The values [Topping] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ToppingForProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productAndOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('Hamburger', 'Dessert', 'Accompaniment', 'Drinks', 'Combo');
ALTER TABLE "product" ALTER COLUMN "type" TYPE "ProductType_new" USING ("type"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "productAndOrder" DROP CONSTRAINT "productAndOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "productAndOrder" DROP CONSTRAINT "productAndOrder_productId_fkey";

-- DropTable
DROP TABLE "ToppingForProduct";

-- DropTable
DROP TABLE "productAndOrder";

-- CreateTable
CREATE TABLE "productByOrder" (
    "id" SERIAL NOT NULL,
    "observation" TEXT,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productByOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toppingByProduct" (
    "id" SERIAL NOT NULL,
    "toppingId" INTEGER NOT NULL,
    "orderProductId" INTEGER NOT NULL,

    CONSTRAINT "toppingByProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productByOrder" ADD CONSTRAINT "productByOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productByOrder" ADD CONSTRAINT "productByOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toppingByProduct" ADD CONSTRAINT "toppingByProduct_orderProductId_fkey" FOREIGN KEY ("orderProductId") REFERENCES "productByOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toppingByProduct" ADD CONSTRAINT "toppingByProduct_toppingId_fkey" FOREIGN KEY ("toppingId") REFERENCES "topping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
