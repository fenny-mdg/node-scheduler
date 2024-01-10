-- AlterTable
ALTER TABLE "Script" ADD COLUMN     "language" TEXT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "ownerId" DROP NOT NULL;
