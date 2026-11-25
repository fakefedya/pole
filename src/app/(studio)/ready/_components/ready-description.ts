import type { InternalHref } from "@/config/site-navigation";
import type { PriceCode } from "@/features/prices/config/price-catalog";

type ReadyProductImage = {
  objectKey: string;
  alt: string;
};

type ReadyProduct = {
  id: string;
  title: string;
  description: string;
  image: ReadyProductImage;
};

type ReadyCatalog<Code extends PriceCode> = {
  title: string;
  description: string;
  includes: string;
  priceCode: Code;
  priceDescription: string;
  note: string;
  sample: {
    label: string;
    title: string;
    description: string;
  };
  products: readonly ReadyProduct[];
};

type ReadyFormat<Code extends PriceCode> = {
  label: string;
  description: string;
  catalog: ReadyCatalog<Code>;
};

type ReadyDescription = {
  hero: {
    title: string;
    description: string;
  };
  formats: {
    interiors: ReadyFormat<"ready-interior">;
    capsules: ReadyFormat<"shopping-capsule">;
  };
  upcoming: {
    title: string;
  };
  adaptation: {
    title: string;
    paragraphs: readonly string[];
    priceCode: "ready-adaptation";
    action: { label: string; href: InternalHref };
  };
  closing: {
    title: string;
    description: string;
    action: { label: string; href: InternalHref };
  };
};

export const readyInformation = {
  hero: {
    title: "Готовые решения для интерьера",
    description:
      "Для целой квартиры или обновления отдельной комнаты. Найдите подходящий формат и посмотрите, что входит в комплект.",
  },
  formats: {
    interiors: {
      label: "Готовые интерьеры",
      description:
        "Для ремонта целой квартиры: визуализации, планировка, рабочие чертежи и спецификации.",
      catalog: {
        title: "Интерьер для целой квартиры",
        description:
          "Цельное решение под определённую планировку. Перед покупкой сравните расположение комнат и размеры с вашей квартирой.",
        includes:
          "Визуализации, план мебели с размерами, рабочие чертежи для исходной планировки и спецификации мебели и отделки.",
        priceCode: "ready-interior",
        priceDescription: "Единая цена за любой готовый интерьер.",
        note: "Адаптация документации под вашу квартиру оплачивается отдельно.",
        sample: {
          label: "Посмотреть пример комплекта",
          title: "Пример комплекта интерьера",
          description:
            "Планировка, рабочие чертежи и спецификация выбранного проекта.",
        },
        products: [
          {
            id: "ready-interior-1",
            title: "Тёплый современный интерьер",
            description:
              "Дерево, мягкие природные оттенки и спокойные фактуры.",
            image: {
              objectKey: "site/ready/catalog/ready-tab-interior-2.jpg",
              alt: "Изображение интерьера №1",
            },
          },
          {
            id: "ready-interior-2",
            title: "Светлый интерьер с акцентами",
            description:
              "Светлая основа, выразительные детали и сочетания для разных комнат.",
            image: {
              objectKey: "site/ready/catalog/ready-tab-interior-1.jpg",
              alt: "Изображение интерьера №1",
            },
          },
        ],
      },
    },
    capsules: {
      label: "Шопинг-капсулы",
      description:
        "Для подбора мебели и декора в комнату: готовое сочетание предметов и список покупок.",
      catalog: {
        title: "Обновите комнату с помощью готовой подборки",
        description:
          "Сочетания мебели и декора для одной комнаты или законченной зоны. Посмотрите образ интерьера и переходите к подбору покупок.",
        includes:
          "Визуальное превью и список мебели и декора: размеры, количество, цены на дату составления и ссылки на магазины.",
        priceCode: "shopping-capsule",
        priceDescription: "Единая цена за любую шопинг-капсулу.",
        note: "Без чертежей и индивидуальной адаптации. Мебель и декор оплачиваются отдельно.",
        sample: {
          label: "Посмотреть пример списка покупок",
          title: "Пример списка покупок",
          description:
            "Предметы мебели и декора, размеры, количество, цены и ссылки на магазины.",
        },
        products: [
          {
            id: "ready-interior-1",
            title: "Тёплый современный интерьер",
            description:
              "Дерево, мягкие природные оттенки и спокойные фактуры.",
            image: {
              objectKey: "site/ready/catalog/ready-tab-interior-1.jpg",
              alt: "Изображение интерьера №1",
            },
          },
          {
            id: "ready-interior-2",
            title: "Светлый интерьер с акцентами",
            description:
              "Светлая основа, выразительные детали и сочетания для разных комнат.",
            image: {
              objectKey: "site/ready/catalog/ready-tab-interior-1.jpg",
              alt: "Изображение интерьера №1",
            },
          },
        ],
      },
    },
  },
  upcoming: {
    title: "Скоро станет доступно",
  },
  adaptation: {
    title: "Нужны чертежи под вашу квартиру?",
    paragraphs: [
      "Проверим, подходит ли выбранная концепция к вашей планировке, и подготовим рабочую документацию для строителей.",
      "Визуализации остаются исходными. Изменение визуальной части проекта в адаптацию не входит.",
    ],
    priceCode: "ready-adaptation",
    action: { label: "Проверить планировку", href: "/contacts" },
  },
  closing: {
    title: "Поможем с выбором",
    description: "Расскажите о вашей квартире и о том, что хочется изменить.",
    action: { label: "Напишите нам", href: "/contacts" },
  },
} satisfies ReadyDescription;
