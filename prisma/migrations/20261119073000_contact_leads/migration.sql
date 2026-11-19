-- Keep taxonomy separate from priced services: these are inquiry categories.
CREATE TYPE "ContactMethod" AS ENUM ('MAX', 'TELEGRAM', 'EMAIL');
CREATE TYPE "ContactLeadStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CLOSED');
CREATE TYPE "ContactMailRecipient" AS ENUM ('STUDIO', 'CLIENT');
CREATE TYPE "ContactMailStatus" AS ENUM ('PENDING', 'SENDING', 'SENT', 'FAILED');

CREATE TABLE "ContactServiceCategory" (
  "code" VARCHAR(40) NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "ContactServiceCategory_pkey" PRIMARY KEY ("code")
);

CREATE TABLE "ContactLead" (
  "id" TEXT NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "categoryCode" VARCHAR(40) NOT NULL,
  "message" TEXT NOT NULL,
  "contactMethod" "ContactMethod" NOT NULL,
  "email" VARCHAR(254) NOT NULL,
  "phone" VARCHAR(32) NOT NULL,
  "status" "ContactLeadStatus" NOT NULL DEFAULT 'NEW',
  "revision" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContactLead_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContactLead_revision_nonnegative" CHECK ("revision" >= 0),
  CONSTRAINT "ContactLead_category_fkey" FOREIGN KEY ("categoryCode") REFERENCES "ContactServiceCategory"("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "ContactMailJob" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "recipient" "ContactMailRecipient" NOT NULL,
  "status" "ContactMailStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedUntil" TIMESTAMP(3),
  "lastError" VARCHAR(120),
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContactMailJob_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContactMailJob_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "ContactLead"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ContactLeadStatusChange" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "actorId" VARCHAR(256) NOT NULL,
  "previous" "ContactLeadStatus" NOT NULL,
  "next" "ContactLeadStatus" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactLeadStatusChange_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContactLeadStatusChange_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "ContactLead"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ContactLeadThrottle" (
  "key" VARCHAR(64) NOT NULL,
  "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ContactLeadThrottle_pkey" PRIMARY KEY ("key"),
  CONSTRAINT "ContactLeadThrottle_count_nonnegative" CHECK ("count" >= 0)
);

CREATE INDEX "ContactLead_status_createdAt_idx" ON "ContactLead"("status", "createdAt" DESC);
CREATE INDEX "ContactLead_categoryCode_createdAt_idx" ON "ContactLead"("categoryCode", "createdAt" DESC);
CREATE INDEX "ContactLead_createdAt_idx" ON "ContactLead"("createdAt" DESC);
CREATE UNIQUE INDEX "ContactMailJob_leadId_recipient_key" ON "ContactMailJob"("leadId", "recipient");
CREATE INDEX "ContactMailJob_status_nextAttemptAt_idx" ON "ContactMailJob"("status", "nextAttemptAt");
CREATE INDEX "ContactLeadStatusChange_leadId_createdAt_idx" ON "ContactLeadStatusChange"("leadId", "createdAt" DESC);

-- Non-destructive, repeat-safe initial categories.
INSERT INTO "ContactServiceCategory"("code", "name", "sortOrder", "isActive") VALUES
 ('individual', 'Индивидуальные услуги', 10, true),
 ('ready', 'Готовые решения', 20, true),
 ('passport', 'Паспорт интерьерного стиля', 30, true),
 ('materials', 'Полезные материалы', 40, true),
 ('other', 'Другое', 50, true)
ON CONFLICT ("code") DO NOTHING;
