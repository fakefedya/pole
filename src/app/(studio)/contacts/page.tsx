
import { Suspense } from "react";
import { ContactsInfoSkeleton } from "../_components/studio-page-skeletons";

import { ContactsHeroSection } from "./_components/contacts-hero";
import { ContactsInfoSection } from "./_components/contacts-info";

function ContactsPage() {
  return (
    <>
      <ContactsHeroSection />
      <Suspense fallback={<ContactsInfoSkeleton />}>
        <ContactsInfoSection />
      </Suspense>
    </>
  );
}

export { ContactsPage as default };
