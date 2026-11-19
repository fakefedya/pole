import { Suspense } from "react";

import { ContactsHeroSection } from "./_components/contacts-hero";
import { ContactsInfoSection } from "./_components/contacts-info";

function ContactsPage() {
  return (
    <>
      <ContactsHeroSection />
      <Suspense fallback={<p className="px-5 py-16 text-brand-neutral">Загружаем форму…</p>}>
        <ContactsInfoSection />
      </Suspense>
    </>
  );
}

export { ContactsPage as default };
