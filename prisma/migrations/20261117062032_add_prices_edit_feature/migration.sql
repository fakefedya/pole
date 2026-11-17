-- CreateTable
CREATE TABLE "ServicePrice" (
    "code" VARCHAR(64) NOT NULL,
    "amount" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" VARCHAR(256),

    CONSTRAINT "ServicePrice_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "ServicePriceChange" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "actorId" VARCHAR(256) NOT NULL,
    "previousAmount" INTEGER NOT NULL,
    "nextAmount" INTEGER NOT NULL,
    "previousPublished" BOOLEAN NOT NULL,
    "nextPublished" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicePriceChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServicePriceChange_code_createdAt_idx" ON "ServicePriceChange"("code", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "ServicePriceChange" ADD CONSTRAINT "ServicePriceChange_code_fkey" FOREIGN KEY ("code") REFERENCES "ServicePrice"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
