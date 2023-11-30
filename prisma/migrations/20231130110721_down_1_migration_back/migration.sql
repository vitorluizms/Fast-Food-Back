/*
  Warnings:

  - You are about to drop the `Combo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductByCombo` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "ProductType" ADD VALUE 'Combo';

-- DropForeignKey
ALTER TABLE "ProductByCombo" DROP CONSTRAINT "ProductByCombo_comboId_fkey";

-- DropForeignKey
ALTER TABLE "ProductByCombo" DROP CONSTRAINT "ProductByCombo_productId_fkey";

-- DropTable
DROP TABLE "Combo";

-- DropTable
DROP TABLE "ProductByCombo";
