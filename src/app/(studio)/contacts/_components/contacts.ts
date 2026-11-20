type Link = {
  label: string;
  href: string;
};

type ContactsInfo = {
  type: "contact" | "social";
  header: string;
  link: Link;
  isVisible?: boolean;
  icon?: string;
};

export const contacts = [
  {
    type: "contact",
    header: "Телеграм",
    link: {
      label: "@studio_pole",
      href: "https://t.me/@studio_pole",
    },
  },
  {
    type: "contact",
    header: "Телефон",
    link: {
      label: "+7 995 607-54-11",
      href: "tel:+79956075411",
    },
  },
  {
    type: "contact",
    header: "Почта студии",
    link: {
      label: "contacts@studiopole.ru",
      href: "mailto:contacts@studiopole.ru",
    },
  },
  {
    type: "contact",
    header: "Для сотрудничества и предложений",
    link: {
      label: "polevaya@studiopole.ru",
      href: "mailto:polevaya@studiopole.ru",
    },
  },
  {
    type: "social",
    header: "Pinterest",
    link: {
      label: "Следить за студией",
      href: "https://ru.pinterest.com/POLEinteriordesign/",
    },
    icon: "brand-pinterest.svg",
  },
  {
    type: "social",
    header: "VK",
    link: {
      label: "Группа студии",
      href: "https://vk.ru/studiopole",
    },
    icon: "brand-vk.svg",
  },
] as readonly ContactsInfo[];
