import Image from "next/image";

import { HeroLighting } from "./hero-lighting";
import { hotspots, scenes } from "./hero-scenes";
import { cn } from "cn";

export function HeroSection() {
  return (
    <HeroLighting scenes={scenes} hotspots={hotspots}>
      <div
        className={cn(
          "absolute top-5 left-5 z-5 block",
          "lg:top-7.5 lg:left-7.5",
        )}
      >
        <Image
          src="/brand/logo-icon.png"
          alt="STUDIO POLE"
          width={64}
          height={64}
        />
      </div>
    </HeroLighting>
  );
}
