import { faGift } from "@fortawesome/pro-light-svg-icons/faGift";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";

import Button from "@/components/atoms/Button/Button";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("cadeaux-d-affaires-vin");

  useMountEffect(() => {
    sendGTMEvent({
      page: "cadeaux_d_affaires",
      pageChapter1: "services",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />

      <div className={styles.containersaga}>
        <div className={styles.souscontainer}>
          <h1>
            <FontAwesomeIcon icon={faGift} /> {t("title")}
          </h1>
          <p>{t("contentPart1")}</p>

          <h3>{t("titlePart2")}</h3>
          <p>{t("contentPart2")}</p>
          <h4>{t("titlePart3")}</h4>
          <p>{t("contentPart3")}</p>

          <Button variant="primaryBlack">
            <a href="/catalogue-cadeaux-d-affaire.pdf">{t("buttontext")}</a>
          </Button>
          <h3>{t("contact")}</h3>
          <p>
            {t("corporateInfo")} <a href={`mailto:${t("email")}`}>{t("email")}</a> {t("tel")}
          </p>
        </div>
      </div>
    </div>
  );
};
export const getStaticProps = getCommonPageStaticProps;

export default Page;
