import { faCircleCheck } from "@fortawesome/pro-light-svg-icons/faCircleCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import Trans from "next-translate/Trans";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LinkButton from "@/components/atoms/Button/LinkButton";
import PaidOrderDetail from "@/components/molecules/PaidOrderDetail";
import Price from "@/components/molecules/Price";
import { SuccesfulPaymentDataLayer } from "@/hooks/useSuccesfulPaymentDataLayer";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("paiement");
  const { query } = useRouter();
  const [displayPaymentInstructions, setDisplayPaymentInstructions] = useState(true);
  const orderNumber = query.orderNumber;
  const orderTotal = query.orderTotal;
  useEffect(() => {
    if (typeof query.isFreeOrder === "string" && query.isFreeOrder === "true") {
      setDisplayPaymentInstructions(false);
    }
  }, [query.isFreeOrder]);

  const paidOrderDetails = [
    t("orderNumber", { orderNumber: orderNumber ?? "" }),
    <Trans
      ns="paiement"
      i18nKey={"orderTotal"}
      key="orderTotal"
      components={[<Price key={0} size="normal" price={Number(orderTotal ?? 0)} />]}
    />,
  ];

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
        {displayPaymentInstructions ? (
          <>
            <h1>
              {t("paymentTaken")}
              <FontAwesomeIcon
                className={styles.icon}
                size="1x"
                color="green"
                icon={faCircleCheck}
              />
            </h1>
            <p>
              {t("validatedMessage")}
              <em> - {t("validatedTeam")}</em>
            </p>
            <hr />
            {paidOrderDetails.map((detail, index) => (
              <PaidOrderDetail key={index}>{detail}</PaidOrderDetail>
            ))}
            <h2>{t("payBankTransfer")}</h2>
            <p>
              <Trans
                ns="paiement"
                i18nKey="bankTransferInstructions"
                components={{ br: <br />, strong: <strong /> }}
              />
            </p>
            <hr />
            <LinkButton href="BUY_WINE_URL">{t("validatedBack")}</LinkButton>
          </>
        ) : (
          <h1>
            {t("validatedFreeOrder")}
            <FontAwesomeIcon className={styles.icon} size="1x" color="green" icon={faCircleCheck} />
          </h1>
        )}
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
