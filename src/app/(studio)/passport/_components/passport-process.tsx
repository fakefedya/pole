import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";

import { passportInformation } from "./passport-description";

export function PassportProcess() {
  const { process } = passportInformation;

  return (
    <SiteSection aria-labelledby="passport-process-title">
      <SiteContainer>
        <h2 id="passport-process-title">{process.title}</h2>
        <ol>
          {process.steps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </SiteContainer>
    </SiteSection>
  );
}
