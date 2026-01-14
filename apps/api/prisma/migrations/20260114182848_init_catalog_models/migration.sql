/*
  Warnings:

  - The `status` column on the `Lesson` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Program` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[termId,lessonNumber]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programId,termNumber]` on the table `Term` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentType` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonNumber` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termNumber` to the `Term` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('draft', 'scheduled', 'published', 'archived');

-- CreateEnum
CREATE TYPE "LessonContentType" AS ENUM ('video', 'article');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "contentType" "LessonContentType" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "durationMs" INTEGER,
ADD COLUMN     "lessonNumber" INTEGER NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "status",
ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Term" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "termNumber" INTEGER NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_termId_lessonNumber_key" ON "Lesson"("termId", "lessonNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Term_programId_termNumber_key" ON "Term"("programId", "termNumber");
