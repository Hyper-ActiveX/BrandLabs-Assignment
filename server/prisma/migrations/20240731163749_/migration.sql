/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price` on the `Book` table. All the data in the column will be lost.
  - The `id` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `availability` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cover_id` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edition_count` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publish_year` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
DROP COLUMN "price",
ADD COLUMN     "availability" BOOLEAN NOT NULL,
ADD COLUMN     "cover_id" INTEGER NOT NULL,
ADD COLUMN     "edition_count" INTEGER NOT NULL,
ADD COLUMN     "publish_year" INTEGER NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("id");
