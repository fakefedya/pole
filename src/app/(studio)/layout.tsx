import { Suspense } from "react";
import "lenis/dist/lenis.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSmoothScroll } from "@/components/layout/site-smooth-scroll";
import { SiteMain } from "@/components/layout/site-main";
import { NoiseEffect } from "@/components/layout/site-noise-effect";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteSmoothScroll>
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>

      <SiteMain>{children}</SiteMain>

      <SiteFooter />
      <NoiseEffect />
    </SiteSmoothScroll>
  );
}

export { SiteLayout as default };
