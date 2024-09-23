import BreadcrumbItem from "@/components/molecules/BreadcrumbItem/BreadcrumbItem";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Breadcrumb.module.scss";

export const ProductPageBreadcrumb = ({
  variantName,
  region,
}: {
  variantName: string;
  region: string;
}) => {
  const { t, lang } = useTranslation("common");

  return (
    <div className={styles.breadcrumb}>
      <BreadcrumbItem link="HOME_URL" name={t("breadcrumbs.homePage")} />
      {" / "}
      <BreadcrumbItem link="BUY_WINE_URL" name={t("breadcrumbs.buyWine")} />
      {" / "}
      <BreadcrumbItem
        link={getPlpUrl({ region: [region] }, lang)}
        name={t(`enums:region.${region}`)}
        dontTranslate
      />
      {" / "}
      <BreadcrumbItem link="HOME_URL" name={variantName} isLast={true} />
    </div>
  );
};
