import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";

import { passportInformation } from "./_components/passport-description";

import { PassportHero } from "./_components/passport-hero";
import { PassportProblems } from "./_components/passport-problems";
import { PassportDna } from "./_components/passport-dna";
import { PassportCaseStudy } from "./_components/passport-case-study";
import { PassportProcess } from "./_components/passport-process";
import { PassportAlbum } from "./_components/passport-album";
import { PassportComparison } from "./_components/passport-comparison";
import { PassportOrder } from "./_components/passport-order";
import { PassportFaq } from "./_components/passport-faq";

export function PassportPage() {
  return (
    <>
      <PassportHero />
      <PassportProblems />
      <PassportDna />
      <PassportCaseStudy />
      <PassportProcess />
      <PassportAlbum />
      <PassportComparison />
      <PassportOrder />
      <SiteSection aria-labelledby="passport-faq-title">
        <SiteContainer>
          <h2 id="passport-faq-title">{passportInformation.faq.title}</h2>
          <PassportFaq items={passportInformation.faq.items} />
        </SiteContainer>
      </SiteSection>
    </>
  );
}

export { PassportPage as default };
