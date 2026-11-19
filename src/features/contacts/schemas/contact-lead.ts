import { z } from "zod";

import { CONTACT_METHODS, CONTACT_STATUSES } from "@/features/contacts/config/contact-labels";

/** +7 or 8, followed by precisely ten digits; separators are optional. */
const russianPhonePattern = /^(?:\+7|8)(?:[\s()\-]*\d){10}[\s()\-]*$/;

/** For deduplication and throttling, 8 and +7 must mean the same number. */
export const normalizeRussianPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  return `+7${digits.slice(1)}`;
};
const safeName = /^[^\r\n\u0000-\u001f\u007f]+$/;

export const contactLeadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя (минимум 2 символа).")
    .max(100, "Имя слишком длинное.").regex(safeName, "Недопустимые символы в имени."),
  categoryCode: z.string().min(1, "Выберите услугу.").max(40)
    .regex(/^[a-z][a-z0-9-]*$/, "Недопустимая услуга."),
  message: z.string().trim().min(10, "Расскажите подробнее о вашем запросе (от 10 символов).")
    .max(3000, "Сообщение слишком длинное (максимум 3000 символов)."),
  contactMethod: z.enum(CONTACT_METHODS.map((item) => item.value), { error: "Выберите способ связи." }),
  email: z.string().trim().min(1, "Укажите почту.").max(254, "Слишком длинный адрес.")
    .email("Укажите корректный email."),
  phone: z.string().trim().min(1, "Укажите телефон.").max(32, "Слишком длинный номер.")
    .regex(russianPhonePattern, "Укажите российский номер: +7 или 8 и ещё 10 цифр."),
  consent: z.boolean().refine((value) => value, "Необходимо согласие на обработку данных."),
  website: z.string().max(120).optional(), // Honeypot: humans never see this field.
});

export type ContactLeadInput = z.input<typeof contactLeadSchema>;
export type ContactLeadData = z.output<typeof contactLeadSchema>;

export const contactLeadStatusSchema = z.object({
  id: z.cuid(),
  status: z.enum(CONTACT_STATUSES.map((item) => item.value)),
  revision: z.number().int().min(0).max(1_000_000_000),
});
