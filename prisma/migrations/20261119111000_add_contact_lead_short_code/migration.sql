-- Keep the CUID primary key: it is referenced by email jobs and status history.
-- Only the human-readable reference is four characters long.
ALTER TABLE "ContactLead" ADD COLUMN "shortCode" VARCHAR(4);

-- Backfill existing leads deterministically without collisions.
-- 32 symbols = 1,048,576 possible four-character references.
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM "ContactLead") > 1048576 THEN
    RAISE EXCEPTION 'Cannot assign four-character codes to more than 1048576 leads';
  END IF;
END $$;

WITH numbered AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt", "id") - 1 AS n
  FROM "ContactLead"
)
UPDATE "ContactLead" AS lead
SET "shortCode" =
    SUBSTRING('23456789ABCDEFGHJKLMNPQRSTUVWXYZ' FROM ((numbered.n / 32768) % 32 + 1)::int FOR 1) ||
    SUBSTRING('23456789ABCDEFGHJKLMNPQRSTUVWXYZ' FROM ((numbered.n / 1024) % 32 + 1)::int FOR 1) ||
    SUBSTRING('23456789ABCDEFGHJKLMNPQRSTUVWXYZ' FROM ((numbered.n / 32) % 32 + 1)::int FOR 1) ||
    SUBSTRING('23456789ABCDEFGHJKLMNPQRSTUVWXYZ' FROM (numbered.n % 32 + 1)::int FOR 1)
FROM numbered
WHERE lead."id" = numbered."id";

ALTER TABLE "ContactLead" ALTER COLUMN "shortCode" SET NOT NULL;
ALTER TABLE "ContactLead" ADD CONSTRAINT "ContactLead_shortCode_format"
  CHECK ("shortCode" ~ '^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$');
CREATE UNIQUE INDEX "ContactLead_shortCode_key" ON "ContactLead"("shortCode");
