-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "description" TEXT,
ADD COLUMN     "language_primary" TEXT NOT NULL DEFAULT 'en';
