import { MaterialsHero } from "./_components/materials-hero";
import { MaterialsCatalog } from "./_components/materials-catalog";
import { MaterialsHow } from "./_components/materials-how";

export function MaterialsPage() {
  return (
    <>
      <MaterialsHero />
      <MaterialsCatalog />
      <MaterialsHow />
    </>
  );
}

export { MaterialsPage as default };
