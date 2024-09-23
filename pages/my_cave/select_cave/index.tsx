/* eslint-disable react/no-unescaped-entities */

// eslint-disable-next-line no-restricted-imports

import { faPuzzle } from "@fortawesome/pro-thin-svg-icons/faPuzzle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import Head from "next/head";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("ma-cave");

  useMountEffect(() => {
    sendGTMEvent({
      page: "select_cave",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={t("meta")} />
      </Head>

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
    </>
  );
};

export const getStaticProps = getCommonPageStaticProps;

// Exportation du composant Page
export default Page;
