-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vinyls" (
    "id" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vinyls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "play_logs" (
    "id" TEXT NOT NULL,
    "vinylId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playedAt" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "play_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "vinyls_userId_idx" ON "vinyls"("userId");

-- CreateIndex
CREATE INDEX "play_logs_vinylId_idx" ON "play_logs"("vinylId");

-- CreateIndex
CREATE INDEX "play_logs_userId_idx" ON "play_logs"("userId");

-- CreateIndex
CREATE INDEX "play_logs_playedAt_idx" ON "play_logs"("playedAt");

-- AddForeignKey
ALTER TABLE "vinyls" ADD CONSTRAINT "vinyls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_logs" ADD CONSTRAINT "play_logs_vinylId_fkey" FOREIGN KEY ("vinylId") REFERENCES "vinyls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_logs" ADD CONSTRAINT "play_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
