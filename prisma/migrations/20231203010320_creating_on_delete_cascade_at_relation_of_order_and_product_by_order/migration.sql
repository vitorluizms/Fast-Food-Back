-- DropForeignKey
ALTER TABLE "productByOrder" DROP CONSTRAINT "productByOrder_orderId_fkey";

-- AddForeignKey
ALTER TABLE "productByOrder" ADD CONSTRAINT "productByOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
