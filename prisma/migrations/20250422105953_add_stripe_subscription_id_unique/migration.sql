/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_sub_id` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCustomerId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePriceId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSubscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Subscription_stripe_sub_id_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "createdAt",
DROP COLUMN "currentPeriodEnd",
DROP COLUMN "priceId",
DROP COLUMN "stripe_sub_id",
ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ADD COLUMN     "stripePriceId" TEXT NOT NULL,
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
