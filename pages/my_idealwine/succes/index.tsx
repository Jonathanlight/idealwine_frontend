import { faCircleCheck } from "@fortawesome/pro-light-svg-icons/faCircleCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { SuccesfulPaymentDataLayer } from "@/hooks/useSuccesfulPaymentDataLayer";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("paiement");

  useMountEffect(() => {
    sendGTMEvent({
      page: "confirmation_commmande",
      pageChapter1: "checkout",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.pageContainer}>
      <SuccesfulPaymentDataLayer />
      <div className={styles.messageContainer}>
        <h1>
          {t("validatedCommand")}
          <FontAwesomeIcon className={styles.icon} size="1x" color="green" icon={faCircleCheck} />
        </h1>
        <p className={styles.content}>
          {t("validatedMessage")}
          <em> - {t("validatedTeam")}</em>
        </p>
        <LinkButton href="BUY_WINE_URL">{t("validatedBack")}</LinkButton>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
