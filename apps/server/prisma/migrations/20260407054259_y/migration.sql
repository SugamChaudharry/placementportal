/*
  Warnings:

  - You are about to drop the column `rollNumber` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "students_rollNumber_key";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "rollNumber";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
