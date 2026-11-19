"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldPath, type UseFormRegister } from "react-hook-form";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { CONTACT_METHODS } from "@/features/contacts/config/contact-labels";
import {
  contactLeadSchema,
  type ContactLeadInput,
} from "@/features/contacts/schemas/contact-lead";
import { createContactLeadAction } from "@/features/contacts/server/actions";

type Props = { categories: readonly { code: string; name: string }[] };

const rowClass =
  "flex flex-col gap-2 md:flex-row md:flex-wrap md:items-baseline md:gap-x-4";
const inputClass = cn(
  "min-w-0 flex-1 border-b border-white/25 bg-transparent px-0 py-2 text-base text-brand-milk",
  "placeholder:text-brand-muted outline-none transition-colors focus:border-brand-milk",
  "aria-invalid:border-red-400 focus-visible:outline-0",
  "sm:text-lg",
);

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="mt-1 text-sm text-red-400">
      {message}
    </p>
  ) : null;
}

/** A native-radio variant styled as selectable chips; dashboard UI is untouched. */
function ContactRadioChips<T extends string>({
  label,
  name,
  options,
  selected,
  error,
  register,
}: {
  label: string;
  name: "categoryCode" | "contactMethod";
  options: readonly { value: T; label: string }[];
  selected?: string;
  error?: string;
  register: UseFormRegister<ContactLeadInput>;
}) {
  return (
    <fieldset className="min-w-0 space-y-3" aria-invalid={!!error}>
      <legend
        className={cn(
          "text-base font-medium sm:text-lg",
          error ? "text-red-400" : "text-brand-milk",
        )}
      >
        {label} <span aria-hidden="true">*</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <label key={item.value} className="relative cursor-pointer">
            <input
              type="radio"
              value={item.value}
              {...register(name)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex min-h-11 items-center justify-center rounded-lg border px-4 py-2 text-center text-sm font-medium",
                "transition-colors duration-150 sm:text-base",
                "text-brand-milk border-white/10 bg-[#1b1b1c] hover:border-white/40",
                "peer-checked:border-brand-milk peer-checked:bg-brand-milk peer-checked:text-brand-black",
                "peer-focus-visible:outline-brand-milk peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3",
                selected === item.value && "shadow-sm",
              )}
            >
              {item.label}
            </span>
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

export function ContactsForm({ categories }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactLeadInput>({
    resolver: zodResolver(contactLeadSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      categoryCode: "",
      message: "",
      contactMethod: undefined,
      email: "",
      phone: "",
      consent: false,
      website: "",
    },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    const response = await createContactLeadAction(values);
    if (response.ok) {
      setSentCode(response.shortCode ?? null);
      setSent(true);
      reset();
      return;
    }
    if (response.code === "INVALID" && response.fieldErrors) {
      for (const [name, message] of Object.entries(response.fieldErrors)) {
        setError(name as FieldPath<ContactLeadInput>, {
          type: "server",
          message,
        });
      }
      setSubmitError("Проверьте выделенные поля.");
    } else if (response.code === "RATE_LIMIT") {
      setSubmitError(
        "Слишком много обращений. Попробуйте отправить заявку позднее.",
      );
    } else {
      setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз.");
    }
  });

  if (sent) {
    return (
      <div
        role="status"
        className="text-brand-milk space-y-5 rounded-xl border border-white/20 p-6"
      >
        <h3 className="font-display text-xl font-semibold uppercase">
          Спасибо за обращение!
        </h3>
        <p className="text-brand-neutral">
          Заявка получена. Мы свяжемся с вами выбранным способом.
        </p>
        {sentCode && (
          <p className="text-brand-neutral text-sm">
            Номер вашей заявки:{" "}
            <strong className="text-brand-milk font-semibold">
              {sentCode}
            </strong>
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setSentCode(null);
          }}
          className="bg-brand-milk text-brand-black rounded-lg px-5 py-3 text-sm font-semibold"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form
      className="text-brand-milk w-full max-w-2xl space-y-8 sm:space-y-10"
      onSubmit={submit}
      noValidate
    >
      <div className="space-y-1">
        <div className={rowClass}>
          <label
            htmlFor="contact-name"
            className={cn(
              "text-base font-medium sm:text-lg",
              errors.name ? "text-red-400" : "text-brand-milk",
            )}
          >
            Меня зовут <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Ваше имя"
            maxLength={100}
            {...register("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={inputClass}
          />
        </div>
        <div id="contact-name-error">
          <FieldError message={errors.name?.message} />
        </div>
      </div>

      <ContactRadioChips
        label="Меня интересует"
        name="categoryCode"
        options={categories.map(({ code, name }) => ({
          value: code,
          label: name,
        }))}
        selected={watch("categoryCode")}
        error={errors.categoryCode?.message}
        register={register}
      />

      <div className="space-y-3">
        <label
          htmlFor="contact-message"
          className={cn(
            "block text-base font-medium sm:text-lg",
            errors.message ? "text-red-400" : "text-brand-milk",
          )}
        >
          Расскажите о задаче <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          maxLength={3000}
          placeholder="Ваша идея, вопрос или описание проекта…"
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          className={cn(
            inputClass,
            "block min-h-40 w-full resize-y rounded-lg border border-white/25 p-4",
          )}
        />
        <div id="contact-message-error">
          <FieldError message={errors.message?.message} />
        </div>
      </div>

      <ContactRadioChips
        label="Как с вами связаться"
        name="contactMethod"
        options={CONTACT_METHODS}
        selected={watch("contactMethod")}
        error={errors.contactMethod?.message}
        register={register}
      />

      <div className="space-y-1">
        <div className={rowClass}>
          <label
            htmlFor="contact-email"
            className={cn(
              "text-base font-medium sm:text-lg",
              errors.email ? "text-red-400" : "text-brand-milk",
            )}
          >
            Почта <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="mail@example.com"
            maxLength={254}
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={inputClass}
          />
        </div>
        <div id="contact-email-error">
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div className="space-y-1">
        <div className={rowClass}>
          <label
            htmlFor="contact-phone"
            className={cn(
              "text-base font-medium sm:text-lg",
              errors.phone ? "text-red-400" : "text-brand-milk",
            )}
          >
            Телефон <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+7 999 000-00-00"
            maxLength={32}
            {...register("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className={inputClass}
          />
        </div>
        <div id="contact-phone-error">
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="contact-website">Сайт компании</label>
        <input
          id="contact-website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          {...register("website")}
        />
      </div>

      <div className="space-y-2">
        <label
          className={cn(
            "flex items-start gap-3 text-sm leading-relaxed",
            errors.consent ? "text-red-400" : "text-brand-neutral",
          )}
        >
          <input
            type="checkbox"
            {...register("consent")}
            className="accent-brand-terracota-accent mt-1 size-4 shrink-0"
          />
          <span>
            Согласен(на) на обработку персональных данных для ответа на
            обращение.{" "}
            <Link
              href="/policies/privacy"
              className="hover:text-brand-milk underline underline-offset-4"
            >
              Политика конфиденциальности
            </Link>
            .
          </span>
        </label>
        <FieldError message={errors.consent?.message} />
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-400">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !categories.length}
        className={cn(
          "inline-flex min-h-12 items-center justify-center rounded-lg px-7 py-3 text-base font-semibold",
          "bg-brand-milk text-brand-black transition-opacity hover:opacity-90",
          "focus-visible:outline-brand-milk focus-visible:outline-2 focus-visible:outline-offset-4",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {isSubmitting ? "Отправляем…" : "Отправить заявку"}
      </button>
      {!categories.length && (
        <p className="text-red-400">
          Отправка временно недоступна. Попробуйте позже.
        </p>
      )}
    </form>
  );
}
