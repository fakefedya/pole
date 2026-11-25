import { InternalHref } from "@/config/site-navigation";
import type { PriceCode } from "@/features/prices/config/price-catalog";
import { ArrowUpRight, LucideIcon, Send } from "lucide-react";

type PriceRow = {
  code: PriceCode;
  note?: string;
  heading?: string;
};

type Link = {
  label: string;
  href: InternalHref;
  icon: LucideIcon;
};

type PriceSection = {
  id: "individual" | "passport" | "interiors" | "capsules" | "materials";
  label: string;
  description: string;
  link?: Link;
  result?: string;
  rows: readonly PriceRow[];
  isList?: boolean;
};

export const pricesInformation = [
  {
    id: "individual",
    label: "Индивидуальные услуги",
    description:
      "Разрабатываем интерьер под ваши задачи, привычки и особенности помещения. Можно заказать отдельную услугу или сопровождение проекта.",
    link: {
      label: "Обсудить задачу",
      href: "/contacts",
      icon: Send,
    },
    isList: true,
    rows: [
      { code: "full-design" },
      { code: "layout-plan" },
      {
        code: "author-supervision",
        note: "До 4 плановых выездов в пределах согласованной территории Санкт-Петербурга.",
      },
      {
        code: "procurement",
        note: "Только от стоимости товаров, закупаемых с участием студии. Не ежемесячный платёж.",
      },
    ],
  },
  {
    id: "passport",
    label: "Паспорт интерьерного стиля",
    description:
      "Собираем ваши предпочтения в понятную инструкцию для дальнейшей работы с интерьером.",
    link: {
      label: "Как устроен паспорт",
      href: "/contact",
      icon: ArrowUpRight,
    },
    result:
      "Персональный PDF: разбор предпочтений, визуальная концепция, палитра, материалы, формы и правила сочетаний. Одна общая стилевая концепция дома и один раунд уточнений.",
    rows: [
      {
        code: "style-passport",
        note: "За персональный паспорт. Без планировки, рабочих чертежей, 3D-визуализаций и подбора товаров со ссылками.",
      },
    ],
  },
  {
    id: "interiors",
    label: "Готовые интерьеры",
    description: "Выберите уже разработанное интерьерное решение.",
    link: {
      label: "Выбрать интерьер",
      href: "/ready",
      icon: ArrowUpRight,
    },
    result:
      "Комплект для квартиры: визуализации, план расстановки мебели с размерами, рабочая документация для исходной планировки и спецификация мебели и отделочных материалов.",
    rows: [
      {
        code: "ready-interior",
        note: "За комплект для представленной планировки. Единая цена для всех вариантов.",
      },
      {
        code: "ready-adaptation",
        heading: "Адаптация — дополнительно",
        note: "Рабочая документация под вашу квартиру после проверки планировки. Визуализации остаются исходными.",
      },
    ],
  },
  {
    id: "capsules",
    label: "Шопинг-капсулы",
    description:
      "Выберите готовое сочетание мебели и декора для комнаты или законченной зоны.",
    link: {
      label: "Выбрать капсулу",
      href: "/contact",
      icon: ArrowUpRight,
    },
    result:
      "Визуальное превью и список покупок: предметы, размеры, количество, цены на дату составления и ссылки на магазины. Без рабочих чертежей и индивидуальной адаптации.",
    rows: [
      {
        code: "shopping-capsule",
        note: "За одну капсулу. Единая цена для всех вариантов. Стоимость мебели и других товаров не входит в цену капсулы.",
      },
    ],
  },
  {
    id: "materials",
    label: "Полезные материалы",
    description: "Небольшие продукты для самостоятельной работы с интерьером.",
    link: {
      label: "Посмотреть материалы",
      href: "/contact",
      icon: ArrowUpRight,
    },
    rows: [],
  },
] as readonly PriceSection[];
