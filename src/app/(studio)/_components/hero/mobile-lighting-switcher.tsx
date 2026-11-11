"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown, Check, SunMoon } from "lucide-react";

import type { HeroScene, HeroSceneId } from "./hero-lighting";

type MobileLightingSwitcherProps = {
  scenes: readonly HeroScene[];
  selectedScene: HeroSceneId;
  onSelectScene: (sceneId: HeroSceneId) => void;
};

export function MobileLightingSwitcher({
  scenes,
  selectedScene,
  onSelectScene,
}: MobileLightingSwitcherProps) {
  const [open, setOpen] = useState(false);

  const activeScene = scenes.find((scene) => scene.id === selectedScene);

  const handleSelect = (sceneId: HeroSceneId) => {
    onSelectScene(sceneId);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="text-brand-milk focus-visible:outline-brand-milk flex h-11 w-[min(17rem,calc(100vw-2rem))] items-center justify-between gap-3 rounded-full border border-white/10 bg-black/50 px-4 shadow-lg backdrop-blur-lg transition-colors duration-200 hover:bg-black/75 focus-visible:outline-2">
        <SunMoon
          size={18}
          className="text-brand-terracota-accent shrink-0"
          aria-hidden="true"
        />

        <span className="flex-1 truncate text-left text-sm font-medium">
          {activeScene?.label ?? "Выбрать освещение"}
        </span>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          side="top"
          align="center"
          sideOffset={10}
          className="z-40 lg:hidden"
        >
          <Popover.Popup className="bg-brand-black/50 text-brand-milk w-(--anchor-width) rounded-2xl border border-white/10 p-1.5 shadow-xl backdrop-blur-xl transition-[opacity,transform] duration-200 ease-out outline-none data-ending-style:translate-y-2 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
            <Popover.Title className="sr-only">
              Выбор сценария освещения
            </Popover.Title>

            <div
              role="group"
              aria-label="Сценарии освещения"
              className="flex flex-col gap-1"
            >
              {scenes.map((scene) => {
                const isSelected = selectedScene === scene.id;

                return (
                  <button
                    key={scene.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelect(scene.id)}
                    className={`focus-visible:outline-brand-milk flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-sm transition-colors duration-200 focus-visible:outline-2 ${
                      isSelected
                        ? "bg-brand-terracota-accent/25 text-brand-milk"
                        : "text-brand-milk/75 hover:text-brand-milk hover:bg-white/10"
                    }`}
                  >
                    <span>{scene.label}</span>

                    {isSelected && (
                      <Check
                        size={16}
                        className="text-brand-terracota-accent shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
