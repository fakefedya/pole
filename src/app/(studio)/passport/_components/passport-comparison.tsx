import Link from "next/link";

import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";

import { passportInformation } from "./passport-description";

export function PassportComparison() {
  const { comparison } = passportInformation;

  return (
    <SiteSection aria-labelledby="passport-comparison-title">
      <SiteContainer>
        <h2 id="passport-comparison-title">{comparison.title}</h2>
        <p>{comparison.description}</p>
        <div>
          {comparison.options.map((option) => (
            <article key={option.title}>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <ul>
                {option.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {option.action && (
                <Link href={option.action.href}>{option.action.label}</Link>
              )}
            </article>
          ))}
        </div>
        <p>{comparison.note}</p>
      </SiteContainer>
    </SiteSection>
  );
}
