/*
  Warnings:

  - You are about to drop the `Dislikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- DropForeignKey
ALTER TABLE "public"."Dislikes" DROP CONSTRAINT "Dislikes_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Dislikes" DROP CONSTRAINT "Dislikes_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Likes" DROP CONSTRAINT "Likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Likes" DROP CONSTRAINT "Likes_userId_fkey";

-- DropTable
DROP TABLE "public"."Dislikes";

-- DropTable
DROP TABLE "public"."Likes";

-- CreateTable
CREATE TABLE "public"."Reaction" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "type" "public"."ReactionType" NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "public"."Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
