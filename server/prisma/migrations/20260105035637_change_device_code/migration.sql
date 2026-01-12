/*
  Warnings:

  - You are about to drop the column `kode` on the `devices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "devices_kode_key";

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "kode",
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "devices_code_key" ON "devices"("code");
