/** Immutable keys only. Service names and ordering come from PostgreSQL. */
export const CONTACT_METHODS = [
  { value: "MAX", label: "MAX" },
  { value: "TELEGRAM", label: "Telegram" },
  { value: "EMAIL", label: "Почта" },
] as const;

export const CONTACT_STATUSES = [
  { value: "NEW", label: "Новая" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "CLOSED", label: "Закрыта" },
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number]["value"];
export type ContactMethodValue = (typeof CONTACT_METHODS)[number]["value"];

export const contactStatusLabel = (status: ContactStatus) =>
  CONTACT_STATUSES.find((item) => item.value === status)?.label ?? status;

export const contactMethodLabel = (method: ContactMethodValue) =>
  CONTACT_METHODS.find((item) => item.value === method)?.label ?? method;
