/*
  Warnings:

  - You are about to drop the column `deviceId` on the `sensor_readings` table. All the data in the column will be lost.
  - Added the required column `deviceCode` to the `sensor_readings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sensor_readings" DROP CONSTRAINT "sensor_readings_deviceId_fkey";

-- DropIndex
DROP INDEX "sensor_readings_deviceId_timestamp_idx";

-- AlterTable
ALTER TABLE "sensor_readings" DROP COLUMN "deviceId",
ADD COLUMN     "deviceCode" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "sensor_readings_deviceCode_timestamp_idx" ON "sensor_readings"("deviceCode", "timestamp");

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_deviceCode_fkey" FOREIGN KEY ("deviceCode") REFERENCES "devices"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
