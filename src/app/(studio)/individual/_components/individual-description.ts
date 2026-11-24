import type { InternalHref } from "@/config/site-navigation";
import type { PriceCode } from "@/features/prices/config/price-catalog";

type IndividualLink = {
  label: string;
  href: InternalHref;
};

type IndividualService = {
  id: string;
  code: PriceCode;
  description: string;
  contentsTitle: string;
  contents: readonly string[];
  action: IndividualLink;
  drawings?: {
    title: string;
    items: readonly string[];
  };
  album?: {
    title: string;
    description: string;
    action?: IndividualLink;
  };
};

type IndividualProcessStep = {
  number: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
};

type IndividualSupportService = {
  code: PriceCode;
  paragraphs: readonly string[];
  note: string;
};

type IndividualDescription = {
  hero: {
    title: string;
    description: string;
  };
  services: readonly IndividualService[];
  process: {
    title: string;
    description: string;
    steps: readonly IndividualProcessStep[];
  };
  support: {
    title: string;
    description: string;
    services: readonly IndividualSupportService[];
  };
  closing: {
    title: string;
    description: string;
    action: IndividualLink;
  };
};

export const individualInformation: IndividualDescription = {
  hero: {
    title: "Интерьер, который начинается с вас",
    description:
      "Разрабатываем проект под ваше пространство, привычки и задачи. От продуманной планировки до подробных решений для реализации.",
  },
  services: [
    {
      id: "layout",
      code: "layout-plan",
      description:
        "Когда важно разобраться с пространством: определить назначение комнат, расставить мебель и найти удобную логику перемещения по дому.",
      contentsTitle: "Что входит в услугу",
      contents: [
        "Консультация дизайнера",
        "Обмеры на объекте",
        "3 варианта планировочного решения",
      ],
      action: { label: "Обсудить планировку", href: "/contacts" },
    },
    {
      id: "full",
      code: "full-design",
      description:
        "Чтобы заранее увидеть будущий интерьер и передать строителям подробный план его реализации. Продумываем пространство, стиль, материалы, мебель и освещение как единое целое.",
      contentsTitle: "Что входит в проект",
      contents: [
        "Консультация дизайнера",
        "Обмеры на объекте",
        "3 варианта планировочного решения",
        "Разработка стилистических концепций",
        "Разработка фотореалистичных 3D-визуализаций",
        "Полный пакет рабочих чертежей",
        "Спецификация материалов",
        "Спецификация мебели",
        "Спецификация освещения",
      ],
      action: { label: "Обсудить задачу", href: "/contacts" },
      drawings: {
        title: "Перечень рабочих чертежей",
        items: [
          "Обмерный план",
          "План демонтажа перегородок и конструкций",
          "План монтажа перегородок и конструкций",
          "План после переустройства",
          "План перепланировки с расстановкой мебели",
          "План размещения и открывания дверей",
          "Ведомость заполнения дверных проемов",
          "План размещения сантехнического оборудования",
          "План размещения теплых полов с привязкой терморегуляторов",
          "План потолка с указанием типа используемого материала, уровней и подсветки",
          "План потолочных декоративных элементов",
          "План размещения и привязки осветительного оборудования",
          "План взаимодействия осветительного оборудования и выключателей",
          "План размещения электроустановочного оборудования",
          "План напольных покрытий",
          "План устройства плинтусов",
          "Развертки по всем помещениям",
          "Эскизы столярных изделий",
        ],
      },
      album: {
        title: "Посмотрите, что вы получите",
        description:
          "Пример альбома проекта: как оформлены рабочие чертежи и спецификации для реализации интерьера.",
        action: { label: "Посмотреть альбом проекта", href: "/" },
      },
    },
  ],
  process: {
    title: "Как создаётся ваш интерьер",
    description:
      "Полный дизайн-проект — четыре последовательных этапа: от знакомства с пространством до документации для реализации.",
    steps: [
      {
        number: "01",
        image: {
          src: "site/individual/process/01-layout.png",
          alt: "Изображение шага №1",
        },
        title: "Обмеры, задание и планировка",
        description:
          "Изучаем пространство и ваши пожелания, составляем техническое задание и разрабатываем 3 варианта планировочного решения.",
      },
      {
        number: "02",
        image: {
          src: "site/individual/process/02-concept.png",
          alt: "Изображение шага №2",
        },
        title: "Создание 2D-концепций",
        description:
          "Определяем стилистику, палитру, материалы и сочетания мебели в двухмерных концепциях интерьера.",
      },
      {
        number: "03",
        image: {
          src: "site/individual/process/03-visualization.png",
          alt: "Изображение шага №3",
        },
        title: "Создание визуализаций",
        description:
          "Показываем будущий интерьер в фотореалистичных 3D-визуализациях: объём, фактуры и освещение.",
      },
      {
        number: "04",
        image: {
          src: "site/individual/process/04-drawings.png",
          alt: "Изображение шага №4",
        },
        title: "Чертежи и спецификации",
        description:
          "Готовим рабочую документацию, спецификации материалов, мебели и освещения для реализации проекта.",
      },
    ],
  },
  support: {
    title: "От проекта — к реализации",
    description:
      "Дополнительные услуги для тех, кому нужна поддержка студии во время ремонта и закупок.",
    services: [
      {
        code: "author-supervision",
        paragraphs: [
          "Проверяем соответствие реализации проектным решениям, отвечаем на вопросы строителей и передаём вам отчёт.",
          "До 4 плановых выездов в месяц в пределах согласованной территории Санкт-Петербурга.",
        ],
        note: "Дополнительные выезды и существенная переработка проекта оплачиваются отдельно. Техническая проверка качества строительства в тариф не входит.",
      },
      {
        code: "procurement",
        paragraphs: [
          "Запрашиваем предложения поставщиков, согласовываем позиции и замены, проверяем счета, сопровождаем заказы и координируем поставки.",
          "Стоимость рассчитывается от товаров, закупаемых с участием студии.",
        ],
        note: "Оплата за согласованный объём закупок, не ежемесячно. Приёмка доставок на объекте оговаривается отдельно.",
      },
    ],
  },
  closing: {
    title: "Начнём с вашей задачи",
    description:
      "Расскажите о пространстве и планах — поможем выбрать формат работы.",
    action: { label: "Напишите нам", href: "/contacts" },
  },
};
