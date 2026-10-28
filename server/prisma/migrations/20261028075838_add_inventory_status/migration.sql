-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('LEGACY', 'RESERVED', 'COMMITTED', 'RELEASED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "inventoryStatus" "InventoryStatus" NOT NULL DEFAULT 'LEGACY';
