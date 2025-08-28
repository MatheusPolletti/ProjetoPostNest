/*
  Warnings:

  - Made the column `dislikes` on table `Posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `likes` on table `Posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Posts" ALTER COLUMN "dislikes" SET NOT NULL,
ALTER COLUMN "dislikes" SET DEFAULT 0,
ALTER COLUMN "likes" SET NOT NULL,
ALTER COLUMN "likes" SET DEFAULT 0;
