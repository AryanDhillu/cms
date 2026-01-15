/*
  Warnings:

  - Added the required column `contentType` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "contentType" "LessonContentType" NOT NULL,
ADD COLUMN     "durationMs" INTEGER;
