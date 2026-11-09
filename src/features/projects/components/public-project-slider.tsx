"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { PublicProjectCard } from "../server/public-queries";
import Image from "next/image";

import {
  Autoplay,
  Pagination,
  EffectFade,
  Mousewheel,
  Keyboard,
  Parallax,
} from "swiper/modules";

type PublicProjectCardsProps = {
  projects: PublicProjectCard[];
};

export function Slider({ projects }: PublicProjectCardsProps) {
  if (!projects || projects.length === 0) {
    return <h1>Проекты не найдены</h1>;
  }

  return (
    <Swiper
      modules={[Mousewheel, Keyboard, Pagination]}
      direction="vertical"
      slidesPerView={1}
      speed={800}
      loop={false}
      mousewheel={{
        enabled: true,
        releaseOnEdges: true,
        forceToAxis: true,
      }}
      touchReleaseOnEdges={true}
      threshold={0}
      keyboard={{
        enabled: true,
        onlyInViewport: true,
      }}
      pagination={{
        clickable: true,
      }}
      className="h-full w-full"
    >
      {projects.map((slide, index) => (
        <SwiperSlide
          key={slide.id}
          className="relative h-full w-full overflow-hidden text-white"
        >
          <div className="absolute inset-0 z-0 h-full w-full">
            <Image
              src={slide.coverUrl}
              alt="Hero Banner Desktop"
              fill
              className={
                slide.coverUrl ? "hidden object-cover md:block" : "object-cover"
              }
              preload={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="100vw"
            />
          </div>
          {slide.title}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
