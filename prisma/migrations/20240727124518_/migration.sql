-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookInfo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fbId" BIGINT NOT NULL,
    "name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "profile_picture_url" TEXT,

    CONSTRAINT "FacebookInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookInfoSecret" (
    "id" SERIAL NOT NULL,
    "facebookInfoId" INTEGER NOT NULL,
    "fbAccessToken" TEXT NOT NULL,
    "fbRefreshToken" TEXT,

    CONSTRAINT "FacebookInfoSecret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookInfo_fbId_key" ON "FacebookInfo"("fbId");

-- CreateIndex
CREATE INDEX "FacebookInfo_userId_idx" ON "FacebookInfo"("userId");

-- CreateIndex
CREATE INDEX "FacebookInfoSecret_facebookInfoId_idx" ON "FacebookInfoSecret"("facebookInfoId");

-- AddForeignKey
ALTER TABLE "FacebookInfo" ADD CONSTRAINT "FacebookInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookInfoSecret" ADD CONSTRAINT "FacebookInfoSecret_facebookInfoId_fkey" FOREIGN KEY ("facebookInfoId") REFERENCES "FacebookInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
