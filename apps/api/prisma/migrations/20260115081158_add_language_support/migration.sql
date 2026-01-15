/*
  Warnings:

  - You are about to drop the column `contentType` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `durationMs` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `language_primary` on the `Program` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "contentType",
DROP COLUMN "durationMs",
ADD COLUMN     "contentLanguagePrimary" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "contentLanguagesAvailable" TEXT[],
ADD COLUMN     "contentUrlsByLanguage" JSONB;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "language_primary",
ADD COLUMN     "languagePrimary" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "languagesAvailable" TEXT[];
