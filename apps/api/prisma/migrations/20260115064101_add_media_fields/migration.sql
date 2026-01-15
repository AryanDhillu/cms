-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_termId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "portraitUrl" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_termId_fkey" FOREIGN KEY ("termId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;
