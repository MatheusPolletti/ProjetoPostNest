/*
  Warnings:

  - Added the required column `content` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Posts" ADD COLUMN     "content" TEXT NOT NULL;
