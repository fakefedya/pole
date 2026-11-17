import { z } from "zod";
import { isPriceCode } from "@/features/prices/config/price-catalog";

/** Reject decimals, negatives, scientific notation, padding and coercion surprises. */
const amountSchema = z
  .string()
  .regex(/^[1-9]\d{0,7}$/, "Укажите целое положительное число до 99 999 999.")
  .transform(Number);

const revisionSchema = z
  .string()
  .regex(/^(0|[1-9]\d{0,8})$/, "Некорректная версия записи.")
  .transform(Number);

export const savePriceSchema = z
  .object({
    code: z.string().max(64).refine(isPriceCode, "Неизвестная услуга."),
    amount: amountSchema,
    expectedRevision: revisionSchema,
    isPublished: z.literal("on").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.code === "procurement" && data.amount > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "Процент должен быть от 1 до 100.",
      });
    }
    if (data.code !== "procurement" && data.amount > 10_000_000) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "Слишком большая сумма для публикации.",
      });
    }
  });
