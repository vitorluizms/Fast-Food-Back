/*
  Warnings:

  - You are about to drop the column `toppings` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `toppingByProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "toppingByProduct" DROP CONSTRAINT "toppingByProduct_orderProductId_fkey";

-- DropForeignKey
ALTER TABLE "toppingByProduct" DROP CONSTRAINT "toppingByProduct_toppingId_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "toppings";

-- AlterTable
ALTER TABLE "productByOrder" ADD COLUMN     "toppings" TEXT;

-- DropTable
DROP TABLE "toppingByProduct";
