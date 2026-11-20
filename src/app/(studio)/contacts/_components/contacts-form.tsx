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
  "min-w-0 flex-1 caret-brand-green bg-transparent px-0 font-medium text-brand-green tracking-wide",
  "placeholder:text-brand-muted placeholder:font-medium outline-none transition-colors focus:border-brand-milk placeholder:font-medium",
  "aria-invalid:border-destructive focus-visible:outline-0",
  "autofill:shadow-[inset_0_0_0px_1000px_#000000] autofill:[-webkit-text-fill-color:#40b873]",
);

const fieldLabels = {
  name: "Меня зовут ",
  category: "Меня интересует... ",
  contact: "Я хочу обсудить... ",
  contactMethod: "Связаться со мной ",
  mail: "Моя почта ",
  phone: "Мой телефон ",
};

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="text-destructive mt-1 text-sm">
      {message}
    </p>
  ) : null;
}

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
          error ? "text-destructive" : "text-brand-milk",
        )}
      >
        {label}{" "}
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
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
                "text-brand-milk flex min-h-11 items-center justify-center rounded-lg border border-none bg-neutral-900 px-5 py-2.5 text-center text-sm font-semibold tracking-wide",
                "transition-colors duration-150 hover:bg-neutral-800",
                "peer-checked:border-brand-milk peer-checked:bg-brand-milk peer-checked:text-brand-black",
                "peer-focus-visible:outline-brand-milk peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3",
                selected === item.value && "hover:bg-brand-milk/80 shadow-sm",
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
      className="text-brand-milk flex w-full max-w-2xl flex-col gap-y-8"
      onSubmit={submit}
      noValidate
    >
      <div>
        <div className={rowClass}>
          <label
            htmlFor="contact-name"
            className={cn(
              "text-base font-medium sm:text-lg",
              errors.name ? "text-destructive" : "text-brand-milk",
            )}
          >
            {fieldLabels.name}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
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
        label={fieldLabels.category}
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
            errors.message ? "text-destructive" : "text-brand-milk",
          )}
        >
          {fieldLabels.contact}
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
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
          className={cn(inputClass, "block min-h-40 w-full resize-none")}
        />
        <div id="contact-message-error">
          <FieldError message={errors.message?.message} />
        </div>
      </div>

      <ContactRadioChips
        label={fieldLabels.contactMethod}
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
              errors.email ? "text-destructive" : "text-brand-milk",
            )}
          >
            {fieldLabels.mail}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
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
              errors.phone ? "text-destructive" : "text-brand-milk",
            )}
          >
            {fieldLabels.phone}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
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
            errors.consent ? "text-destructive" : "text-brand-neutral",
          )}
        >
          <input
            type="checkbox"
            {...register("consent")}
            className="accent-brand-terracota-accent mt-1 size-4 shrink-0"
          />
          <span className="text-brand-muted leading-tight font-medium">
            Согласен(на) на обработку персональных данных для ответа на
            обращение.{" "}
            <Link
              href="/policies/privacy"
              className="hover:text-brand-milk/80 text-brand-milk"
            >
              Политика конфиденциальности
            </Link>
            .
          </span>
        </label>
        <FieldError message={errors.consent?.message} />
      </div>

      {submitError && (
        <p role="alert" className="text-destructive text-sm">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting || !categories.length}
        className={cn(
          "inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg px-7 py-3 text-base font-semibold",
          "bg-brand-milk text-brand-black transition-opacity hover:opacity-90",
          "focus-visible:outline-brand-milk focus-visible:outline-2 focus-visible:outline-offset-4",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "lg:w-fit",
        )}
      >
        {isSubmitting ? "Отправляем…" : "Отправить сообщение"}
      </button>
      {!categories.length && (
        <p className="text-destructive">
          Отправка временно недоступна. Попробуйте позже.
        </p>
      )}
    </form>
  );
}
