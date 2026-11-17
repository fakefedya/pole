-- Prices are unpublished by default: mockup numbers must not go live unintentionally.
CREATE TABLE "ServicePrice" (
  "code" VARCHAR(64) NOT NULL,
  "amount" INTEGER NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "revision" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedById" VARCHAR(256),
  CONSTRAINT "ServicePrice_pkey" PRIMARY KEY ("code"),
  CONSTRAINT "ServicePrice_amount_positive" CHECK ("amount" > 0),
  CONSTRAINT "ServicePrice_revision_nonnegative" CHECK ("revision" >= 0)
);

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

CREATE INDEX "ServicePriceChange_code_createdAt_idx"
  ON "ServicePriceChange" ("code", "createdAt" DESC);

ALTER TABLE "ServicePriceChange"
  ADD CONSTRAINT "ServicePriceChange_code_fkey" FOREIGN KEY ("code")
  REFERENCES "ServicePrice"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Initial data comes from POLE-prices-v1.html (2026-11-17). Review before publishing.
INSERT INTO "ServicePrice" ("code", "amount", "isPublished", "revision", "updatedAt") VALUES
  ('full-design',       4500, false, 0, CURRENT_TIMESTAMP),
  ('layout-plan',       1500, false, 0, CURRENT_TIMESTAMP),
  ('author-supervision',35000, false, 0, CURRENT_TIMESTAMP),
  ('procurement',         10, false, 0, CURRENT_TIMESTAMP),
  ('style-passport',   14900, false, 0, CURRENT_TIMESTAMP),
  ('ready-interior',   19900, false, 0, CURRENT_TIMESTAMP),
  ('ready-adaptation', 1500, false, 0, CURRENT_TIMESTAMP),
  ('shopping-capsule',  3900, false, 0, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;
