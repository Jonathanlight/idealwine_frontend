import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { WineVarietiesDiscoveryPageBreadCrumb } from "@/components/organisms/Breadcrumb/WineVarietiesDiscoveryPageBreadCrumb";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { codeToTranslated } from "@/utils/algoliaUrlsDataGenerator";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t, lang } = useTranslation();

  useMountEffect(() => {
    sendGTMEvent({
      page: "cepages",
      pageChapter1: "edito",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo
        title={t("wine-varieties:seo.title")}
        description={t("wine-varieties:seo.description")}
      />

      <WineVarietiesDiscoveryPageBreadCrumb />
      <h1 className={styles.title}>{t("wine-varieties:title")}</h1>
      <div className={styles.text}>{t("wine-varieties:text")}</div>
      <div className={styles.varietiesContainer}>
        <h2 className={styles.subtitle}>{t("wine-varieties:subtitle")}</h2>
        <div className={styles.varieties}>
          {Object.keys(codeToTranslated.grapeVariety.translatedValues).map(variety => (
            <div key={variety} className={styles.linkContainer}>
              <TranslatableLink
                className={styles.link}
                href={getPlpUrl({ grapeVariety: [variety] }, lang)}
                dontTranslate
              >
                {t(`enums:wineVarieties.${variety}`)}
              </TranslatableLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
