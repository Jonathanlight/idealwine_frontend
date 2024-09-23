import { faPuzzle } from "@fortawesome/pro-thin-svg-icons/faPuzzle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("j-y-connais-rien");

  useMountEffect(() => {
    sendGTMEvent({
      page: "j_y_connais_rien",
      pageChapter1: "services",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />

      <div className={styles.gridwrappercave}>
        <div>
          <FontAwesomeIcon icon={faPuzzle} />

          <h1>{t("welcome")}</h1>
          <p>{t("item")}</p>

          <LinkButton href="BUY_WINE_URL" variant="primaryGolden">
            {t("buttontext")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
