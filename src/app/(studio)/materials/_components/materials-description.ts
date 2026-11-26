import type { InternalHref } from "@/config/site-navigation";

export type MaterialProduct = {
  id: string;
  coverColor: string;
  type: string;
  title: string;
  description: string;
  price: number | null;
  contents: readonly string[];
};

type MaterialsInformation = {
  hero: {
    titleLines: readonly [string, string];
    description: string;
  };
  catalog: {
    title: string;
    items: readonly MaterialProduct[];
  };
  how: {
    title: string;
    paragraphs: readonly string[];
    action: { label: string; href: InternalHref };
  };
  closing: {
    title: string;
    description: string;
    action: { label: string; href: InternalHref };
  };
};

export const materialsInformation = {
  hero: {
    titleLines: ["Меньше хаоса.", "Больше ясности"],
    description:
      "Полезные материалы для самостоятельной работы с интерьером: чтобы упорядочить задачи, спланировать бюджет и собрать покупки.",
  },
  catalog: {
    title: "Выберите помощника под задачу",
    items: [
      {
        id: "renovation-checklist",
        coverColor: "bg-brand-cacao",
        type: "Памятка",
        title: "Чек-лист ремонта",
        description:
          "Соберите основные задачи в одном месте и отмечайте, что уже сделано.",
        price: 1999,
        contents: [
          "Список вопросов перед началом ремонта",
          "Задачи для подготовки и последовательного планирования",
          "Место для отметок и собственных дополнений",
        ],
      },
      {
        id: "renovation-budget",
        coverColor: "bg-brand-olive",
        type: "Рабочая таблица",
        title: "Таблица бюджета",
        description:
          "Планируйте расходы по категориям и сравнивайте ожидания с фактическими тратами.",
        price: 5999,
        contents: [
          "Категории расходов на ремонт и обустройство",
          "Плановые и фактические суммы",
          "Поля для комментариев и учёта изменений",
        ],
      },
      {
        id: "shopping-plan",
        coverColor: "bg-brand-terracota",
        type: "Рабочая таблица",
        title: "План покупок",
        description:
          "Соберите выбранные товары, ссылки и сроки в удобный список для закупок.",
        price: null,
        contents: [
          "Список покупок по комнатам",
          "Размеры, количество, стоимость и ссылки",
          "Статусы заказа и ожидаемые сроки доставки",
        ],
      },
    ],
  },
  how: {
    title: "Инструменты для ваших собственных решений",
    paragraphs: [
      "Материалы помогают организовать работу с интерьером: держать под рукой задачи, цифры и выбранные товары.",
      "Если нужна уже собранная подборка мебели или готовый проект квартиры, посмотрите «Готовые решения».",
    ],
    action: { label: "К готовым решениям", href: "/ready" },
  },
  closing: {
    title: "Не нашли нужный материал?",
    description:
      "Напишите, с какой задачей столкнулись. Поможем выбрать подходящий формат.",
    action: { label: "Напишите нам", href: "/contacts" },
  },
} satisfies MaterialsInformation;
