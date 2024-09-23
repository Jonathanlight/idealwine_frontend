import { faCameraRetro } from "@fortawesome/pro-light-svg-icons/faCameraRetro";
import { faCctv } from "@fortawesome/pro-light-svg-icons/faCctv";
import { faCubes } from "@fortawesome/pro-light-svg-icons/faCubes";
import { faKeySkeleton } from "@fortawesome/pro-light-svg-icons/faKeySkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";

import Button from "@/components/atoms/Button/Button";
import StorageCellarDialog from "@/components/organisms/StorageCellarContactDialog/StorageCellarContactDialog";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const [isCellarStorageModalOpen, setIsCellarStorageModalOpen] = useState<boolean>(false);
  const { t } = useTranslation("cave-de-stockage");

  useMountEffect(() => {
    sendGTMEvent({
      page: "cave_de_stockage",
      pageChapter1: "services",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.firstPart}>
        <div className={styles.firstPartLeft}>
          <h1 className={styles.firstPartTitle}>{t("firstPartTitle")}</h1>
          <p className={styles.firstPartText}>{t("firstPartTextP1")}</p>
          <p className={styles.firstPartText}>{t("firstPartTextP2")}</p>
          <Button
            variant="primaryBlack"
            className={styles.buttonOne}
            onClick={() => {
              setIsCellarStorageModalOpen(true);
            }}
          >
            {t("contactUs")}
          </Button>
          <StorageCellarDialog
            open={isCellarStorageModalOpen}
            setOpen={setIsCellarStorageModalOpen}
          />
        </div>
        <div className={styles.firstPartRight}>
          <Image
            className={styles.image}
            src="/cave_stockage_idealwine.jpg"
            alt={t("idealwineCellar")}
            width={445}
            height={480}
          />
          <br />
        </div>
      </div>
      <div className={styles.secondPart}>
        <p className={styles.title}>
          {t("secondPartTitle").toLocaleUpperCase()} <FontAwesomeIcon icon={faCubes} />
        </p>
        <p className={styles.text}>{t("secondPartText")}</p>
      </div>

      <div className={styles.fourthPart}>
        <p className={styles.title}>
          {t("thirdPartTitle").toLocaleUpperCase()} <FontAwesomeIcon icon={faCctv} />
        </p>
        <div className={styles.text}>{t("thirdPartText")}</div>
      </div>
      <div className={styles.fifthPart}>
        <p className={styles.title}>
          {t("fourthPartTitle").toLocaleUpperCase()} <FontAwesomeIcon icon={faCameraRetro} />
        </p>

        <p className={styles.text}>{t("fourthPartText")}</p>
      </div>
      <div className={styles.thirdPart}>
        <p className={styles.title}>
          {t("fifthPartTitle").toLocaleUpperCase()} <FontAwesomeIcon icon={faKeySkeleton} />
        </p>
        <p className={styles.text}>{t("fifthPartText")}</p>
      </div>
      <div className={styles.seventhPart}>
        <Button
          variant="primaryBlack"
          className={styles.buttonOne}
          onClick={() => {
            setIsCellarStorageModalOpen(true);
          }}
        >
          {t("contactUs")}
        </Button>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
