-- Seed only known tariff codes. Never overwrite user-edited prices.
-- Rows remain unpublished until explicitly approved in /dashboard/prices.
INSERT INTO "ServicePrice" ("code", "amount", "isPublished", "revision", "updatedAt") VALUES
  ('full-design',        4500, false, 0, CURRENT_TIMESTAMP),
  ('layout-plan',        1500, false, 0, CURRENT_TIMESTAMP),
  ('author-supervision',35000, false, 0, CURRENT_TIMESTAMP),
  ('procurement',          10, false, 0, CURRENT_TIMESTAMP),
  ('style-passport',    14900, false, 0, CURRENT_TIMESTAMP),
  ('ready-interior',    19900, false, 0, CURRENT_TIMESTAMP),
  ('ready-adaptation',  1500, false, 0, CURRENT_TIMESTAMP),
  ('shopping-capsule',   3900, false, 0, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;
