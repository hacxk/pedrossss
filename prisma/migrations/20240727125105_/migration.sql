/*
  Warnings:

  - The primary key for the `FacebookInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "FacebookInfoSecret" DROP CONSTRAINT "FacebookInfoSecret_facebookInfoId_fkey";

-- AlterTable
ALTER TABLE "FacebookInfo" DROP CONSTRAINT "FacebookInfo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FacebookInfo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FacebookInfo_id_seq";

-- AlterTable
ALTER TABLE "FacebookInfoSecret" ALTER COLUMN "facebookInfoId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "FacebookInfoSecret" ADD CONSTRAINT "FacebookInfoSecret_facebookInfoId_fkey" FOREIGN KEY ("facebookInfoId") REFERENCES "FacebookInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
