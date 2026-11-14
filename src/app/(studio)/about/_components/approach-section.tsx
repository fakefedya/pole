import { SiteContainer } from "@/components/layout/site-container";
import { SiteSection } from "@/components/layout/site-section";
import { cn } from "@/lib/utils";

const approachDescription = [
  {
    title: "Пространство для вашей жизни",
    description:
      "Удобная организация комнат, продуманное хранение и внимание к привычкам каждого члена семьи. Дом должен быть комфортным для взрослых, детей и домашних животных.",
  },
  {
    title: "Интерьер с вашим характером",
    description:
      "Стиль рождается из ваших предпочтений. Подбираем цвет, материалы, формы и фактуры так, чтобы они складывались в цельный интерьер, в котором вам приятно жить.",
  },
  {
    title: "Красота, которая работает каждый день",
    description:
      "Для нас эстетика связана с практичностью: как вы перемещаетесь по дому, где храните вещи, какой свет нужен утром и вечером. Именно из таких деталей складывается ощущение уюта.",
  },
];

export function ApproachSection() {
  return (
    <SiteSection>
      <SiteContainer
        className={cn("z-2 px-5 pt-10 pb-10", "lg:px-10 lg:pt-20 lg:pb-64")}
      >
        <div className="grid grid-cols-12">
          <div className={cn("col-span-12", "lg:col-span-6")}>
            <h3
              className={cn(
                "text-brand-milk font-display text-2xl font-semibold",
                "lg:text-3xl",
              )}
            >
              Что для нас важно в интерьере
            </h3>
          </div>
          <div
            className={cn(
              "col-span-12 flex flex-col gap-y-16 pl-20",
              "lg:col-span-6",
            )}
          >
            {approachDescription.map((el) => (
              <div key={el.title} className="flex flex-col gap-y-4">
                <h4
                  className={cn(
                    "text-brand-milk text-xl font-medium",
                    "lg:text-2xl",
                  )}
                >
                  {el.title}
                </h4>
                <p className="text-brand-neutral text-lg">{el.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SiteContainer>
    </SiteSection>
  );
}
