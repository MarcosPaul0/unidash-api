/*
  Warnings:

  - You are about to drop the column `actionPlansDescription` on the `courseCoordinationData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courseCoordinationData" DROP COLUMN "actionPlansDescription",
ALTER COLUMN "academicActionPlans" DROP NOT NULL,
ALTER COLUMN "academicActionPlans" DROP DEFAULT,
ALTER COLUMN "academicActionPlans" SET DATA TYPE VARCHAR(360),
ALTER COLUMN "administrativeActionPlans" DROP NOT NULL,
ALTER COLUMN "administrativeActionPlans" DROP DEFAULT,
ALTER COLUMN "administrativeActionPlans" SET DATA TYPE VARCHAR(360);
