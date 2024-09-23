import { NextSeo } from "next-seo";

import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("viticulture");

  return (
    <div>
      <div className={styles.wrapper}>
        <NextSeo title={t("seo.title")} description={t("seo.description")} />

        <div className={styles.content1}>
          <h1>{t("h1")}</h1>
          <p>
            {t("viticulture_general")}{" "}
            <a href={t("viticulture_general-a")}>{t("viticulture_general-txt-a")}</a>
          </p>
        </div>
        <div className={styles.bg}>
          <div className={styles.content2}>
            <div>
              <h2>{t("h2-2")}</h2>
              <p>{t("viticulture_biodynamie")}</p>
            </div>

            <div>
              <h2>{t("h2-3")}</h2>
              <p> {t("viticulture_biologique")}</p>
            </div>
            <div>
              <h2>{t("h2-4")}</h2> <p>{t("viticulture_raisonee")}</p>
            </div>

            <div>
              <h2>{t("h2-5")}</h2> <p>{t("viticulture_ecologique")}</p>
            </div>

            <div>
              <h2>{t("h2-6")}</h2> <p>{t("viticulture_nature")}</p>
            </div>

            <div>
              <h2>{t("h2-7")}</h2>
              <p>{t("viticulture_triplea")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
