import Head from "next/head";
import Image from "next/image";

import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { PLPIndexName } from "@/hooks/useAlgoliaRefinements";
import { useTranslation } from "@/utils/next-utils";

import Button from "../Button";
import TranslatableLink from "../TranslatableLink";
import styles from "./QuintessenceCellarBanner.module.scss";

export const quintessenceSaleLink = {
  pageKey: "BUY_WINE_URL",
  params: { quintessenceSale: [1], sortBy: [`${PLPIndexName}_price_desc`] },
};

const QuintessenceCellarBanner = () => {
  const { t, lang } = useTranslation("accueil-profil");
  const imageUrl = `/quintessenceBannerRight_${lang}.jpg`;

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/qea1cff.css" />
      </Head>
      <div className={styles.mainContainer}>
        <div className={styles.textContainer}>
          <p className={styles.title}>{t("loyaltyProgramMenu.quintessenceCellar.title")}</p>
          <p className={styles.description}>
            {t("loyaltyProgramMenu.quintessenceCellar.description")}
          </p>
          <TranslatableLink href={getPlpUrl(quintessenceSaleLink.params, lang)} dontTranslate>
            <Button variant="primaryGolden" className={styles.button}>
              {t("loyaltyProgramMenu.quintessenceCellar.title")}
            </Button>
          </TranslatableLink>
        </div>
        <Image
          src={imageUrl}
          alt={t("loyaltyProgramMenu.quintessenceCellar.title")}
          width={384}
          height={284}
        />
      </div>
    </>
  );
};

export default QuintessenceCellarBanner;
