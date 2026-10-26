-- CreateTable
CREATE TABLE "StagedProjectUpload" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "tempKey" VARCHAR(240) NOT NULL,
    "finalKey" VARCHAR(240) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" VARCHAR(16) NOT NULL DEFAULT 'STAGED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StagedProjectUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageDeletionJob" (
    "id" TEXT NOT NULL,
    "bucket" VARCHAR(128) NOT NULL,
    "objectKey" VARCHAR(240) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StorageDeletionJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StagedProjectUpload_tempKey_key" ON "StagedProjectUpload"("tempKey");

-- CreateIndex
CREATE UNIQUE INDEX "StagedProjectUpload_finalKey_key" ON "StagedProjectUpload"("finalKey");

-- CreateIndex
CREATE INDEX "StagedProjectUpload_projectId_status_idx" ON "StagedProjectUpload"("projectId", "status");

-- CreateIndex
CREATE INDEX "StagedProjectUpload_expiresAt_idx" ON "StagedProjectUpload"("expiresAt");

-- CreateIndex
CREATE INDEX "StorageDeletionJob_createdAt_idx" ON "StorageDeletionJob"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StorageDeletionJob_bucket_objectKey_key" ON "StorageDeletionJob"("bucket", "objectKey");
