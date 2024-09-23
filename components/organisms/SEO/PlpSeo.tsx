import { NextSeo } from "next-seo";

import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyString, isPositiveNumber } from "@/utils/ts-utils";

type MetaTagsContent =
  | { translationKey: "default" | "withQuery"; params?: Record<string, string> }
  | {
      translationKey: "withFilters";
      params: {
        regions: string[] | null;
        appellations: string[] | null;
        colors: string[] | null;
        vintages: string[] | null;
      };
      isDirectPurchase?: string | null;
    };

type Props = {
  shouldBeIndexed: boolean;
  metaTagsContent: MetaTagsContent;
};

export const PlpSeo = ({ shouldBeIndexed, metaTagsContent }: Props) => {
  const { t } = useTranslation();

  const getTranslatedFiltersMetaTagsContent = ({
    translationKey,
    params,
    isDirectPurchase,
  }: MetaTagsContent & { translationKey: "withFilters" }) => {
    const startsWithColor =
      !isPositiveNumber(params.regions?.length) &&
      !isPositiveNumber(params.appellations?.length) &&
      isPositiveNumber(params.colors?.length);
    const vintages = params.vintages?.join(" ");
    const translatedFilters = [
      !startsWithColor && t("acheter-du-vin:seo.firstOf"), // In italian, we want to skip this part, therefore we used a second key
      params.regions
        ?.map(region => isNonEmptyString(region) && t(`enums:region.${region}`))
        .join(" "),
      params.appellations?.join(" "),
      params.colors
        ?.map(color => isNonEmptyString(color) && t(`enums:color.${color}`).toLocaleLowerCase())
        .join(" "),
      startsWithColor && isNonEmptyString(vintages) && t("acheter-du-vin:seo.of"),
      vintages,
      t(`acheter-du-vin:seo.withFilters.isDirectPurchase.${isDirectPurchase ?? "notSelected"}`),
    ]
      .filter(isNonEmptyString)
      .join(" ");

    return {
      title: t(`acheter-du-vin:seo.${translationKey}.title`, {
        filtersAndPurchaseType: translatedFilters,
      }),
      description: t(`acheter-du-vin:seo.${translationKey}.description`, {
        filtersAndPurchaseType: translatedFilters,
      }),
    };
  };

  const getTranslatedMetaTagsContent = (content: MetaTagsContent) => {
    const { translationKey, params } = content;
    switch (translationKey) {
      case "withQuery":
        return {
          title: t(`acheter-du-vin:seo.${translationKey}.title`, params),
          description: t(`acheter-du-vin:seo.${translationKey}.description`, params),
        };
      case "withFilters":
        return getTranslatedFiltersMetaTagsContent(content);
      default:
        return {
          title: t(`acheter-du-vin:seo.${translationKey}.title`),
          description: t(`acheter-du-vin:seo.${translationKey}.description`),
        };
    }
  };

  const { title, description } = getTranslatedMetaTagsContent(metaTagsContent);

  return <NextSeo noindex={!shouldBeIndexed} title={title} description={description} />;
};
