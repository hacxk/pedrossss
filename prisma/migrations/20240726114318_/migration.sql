-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "session" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFBInfo" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "fbId" TEXT NOT NULL,

    CONSTRAINT "UserFBInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserFBInfo_userId_key" ON "UserFBInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFBInfo_fbId_key" ON "UserFBInfo"("fbId");

-- AddForeignKey
ALTER TABLE "UserFBInfo" ADD CONSTRAINT "UserFBInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
