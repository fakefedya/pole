export const PRICE_CATALOG = [
  { code: "full-design", title: "Полный дизайн-проект", unit: "RUB_SQM" },
  { code: "layout-plan", title: "Планировочное решение", unit: "RUB_SQM" },
  {
    code: "author-supervision",
    title: "Авторское сопровождение",
    unit: "RUB_MONTH_FROM",
  },
  { code: "procurement", title: "Комплектация", unit: "PERCENT_PURCHASES" },
  {
    code: "style-passport",
    title: "Паспорт интерьерного стиля",
    unit: "RUB_FIXED",
  },
  { code: "ready-interior", title: "Готовые интерьеры", unit: "RUB_FIXED" },
  {
    code: "ready-adaptation",
    title: "Адаптация готового интерьера",
    unit: "RUB_SQM",
  },
  { code: "shopping-capsule", title: "Шопинг-капсула", unit: "RUB_FIXED" },
] as const;

export type PriceCode = (typeof PRICE_CATALOG)[number]["code"];
export type PriceUnit = (typeof PRICE_CATALOG)[number]["unit"];

export const isPriceCode = (value: unknown): value is PriceCode =>
  typeof value === "string" &&
  PRICE_CATALOG.some((item) => item.code === value);

export const getPriceDefinition = (code: PriceCode) =>
  PRICE_CATALOG.find((item) => item.code === code)!;

export const formatPrice = (amount: number, unit: PriceUnit) => {
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(amount);

  switch (unit) {
    case "RUB_SQM":
      return `${formatted} ₽ / м²`;
    case "RUB_MONTH_FROM":
      return `от ${formatted} ₽ / месяц`;
    case "PERCENT_PURCHASES":
      return `${formatted}% от стоимости закупок`;
    case "RUB_FIXED":
      return `${formatted} ₽`;
  }
};
