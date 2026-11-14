import { cn } from "@/lib/utils";
import { getPublicImageUrl } from "@/lib/storage/public-image";

type Props = {
  isVisible?: boolean;
  className?: string;
};

const NOISE_IMAGE = getPublicImageUrl("site/shared/noise.png");

export function NoiseEffect({ isVisible = true, className }: Props) {
  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-40 overflow-hidden",
        "opacity-[0.06]",
        className,
      )}
    >
      <div
        className={cn(
          "absolute -inset-1/4 bg-repeat opacity-[0.55]",
          "animate-site-noise motion-reduce:animate-none",
        )}
        style={{
          backgroundImage: `url("${NOISE_IMAGE}")`,
        }}
      />
    </div>
  );
}
