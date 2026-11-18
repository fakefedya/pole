type Link = {
  label: string;
  href: string;
};

type ContactsInfo = {
  type: "contact" | "social";
  header: string;
  link: Link;
  isVisible?: boolean;
};

export const contacts = [
  {
    type: "contact",
    header: "Телеграм",
    link: {
      label: "@polinaindesign",
      href: "https://t.me/polinaindesign",
    },
  },
  {
    type: "contact",
    header: "Телефон",
    link: {
      label: "+7 995 607-54-11",
      href: "+79956075411",
    },
  },
  {
    type: "contact",
    header: "Почта студии",
    link: {
      label: "contacts@studiopole.ru",
      href: "contacts@studiopole.ru",
    },
  },
  {
    type: "contact",
    header: "Для сотрудничества и предложений",
    link: {
      label: "polevaya@studiopole.ru",
      href: "cpolevaya@studiopole.ru",
    },
  },
  {
    type: "contact",
    header: "Для сотрудничества и предложений",
    link: {
      label: "polevaya@studiopole.ru",
      href: "cpolevaya@studiopole.ru",
    },
  },
  {
    type: "social",
    header: "Следить за студией",
    link: {
      label: "Pinterest",
      href: "https://ru.pinterest.com/POLEinteriordesign/",
    },
  },
  {
    type: "social",
    header: "Следить за студией",
    link: {
      label: "VK",
      href: "https://vk.ru/studiopole",
    },
  },
] as readonly ContactsInfo[];
