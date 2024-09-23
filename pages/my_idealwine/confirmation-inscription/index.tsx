import { NextSeo } from "next-seo";
import Trans from "next-translate/Trans";
import Image from "next/image";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation("confirmation-inscription");

  return (
    <div className={styles.pageContainer}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.bienvenueBlock}>
        <h1 className={styles.upperCase}>{t("welcome")}</h1>
        <div className={styles.text}>
          <p>{t("confirmationMail")}</p>
        </div>
        <div className={styles.text}>
          <p className={styles.upperCase}>
            <strong> {t("important")} </strong>
          </p>
          <p>{t("inscriptionReminder")}</p>
        </div>
        <div>
          <LinkButton href="MY_IDEALWINE_HOME_URL" variant="primaryBlack" className={styles.button}>
            {t("completeProfile")}
          </LinkButton>
        </div>
        <p className={styles.text}>
          {/* eslint-disable-next-line react/jsx-key */}
          <Trans i18nKey="offer" components={[<strong />]} />
        </p>
        <h3>{t("refer")}</h3>
        <div className={styles.text}>
          <p>{t("firstSale")}</p>
          <p>{t("referInstructions")}</p>
          <p>{t("moreInfo")}</p>
        </div>
        <div className={styles.text}>
          <p>{t("goodbye")}</p>
          <br />
          <p>{t("signature")}</p>
        </div>
        <hr />
        <p>
          <LinkButton href="MY_IDEALWINE_HOME_URL" variant="primaryBlack" className={styles.button}>
            {t("common:login.myIDealwine")}
          </LinkButton>
        </p>
      </div>
      <Image
        src={"/bienvenue-photo.jpg"}
        alt="bienvenue-photo"
        width={599}
        height={599}
        className={styles.welcomeImage}
      />
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
