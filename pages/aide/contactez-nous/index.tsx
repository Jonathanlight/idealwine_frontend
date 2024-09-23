import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";

import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t, lang } = useTranslation("contactez-nous");

  const { user } = useAuthenticatedUserContext();

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";

  useMountEffect(() => {
    sendGTMEvent({
      page: "contactez_nous",
      pageChapter1: "aide",
      pageChapter2: "",
    });
  });

  return (
    <>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.board}>
        <div className={styles.container}>
          <h1>{t("contactIdealwine").toLocaleUpperCase()}</h1>

          {!user ? (
            <div className={styles.iframeBox}>
              <br />
              <p>{t("connectToFacilitate").toLocaleUpperCase()}</p>
              <p>{t("theTreatmentOfYourCommand").toLocaleUpperCase()}</p>
              <br />
              <br />
              <p className={styles.bold}>{t("hello")}</p>
              {lang === "fr" && (
                <iframe
                  className={styles.iframe}
                  title="contact-iframe"
                  src="https://www.idealwine.biz/Tickets/ticket.php?ref=&fn=&ln=&em=&language=fr"
                  frameBorder="0"
                  height="600"
                  scrolling="auto"
                  width="100%"
                ></iframe>
              )}
              {lang === "en" && (
                <iframe
                  className={styles.iframe}
                  title="contact-iframe"
                  src="https://www.idealwine.biz/Tickets/ticketUk.php?ref=&fn=&ln=&em=&language=en"
                  frameBorder="0"
                  height="600"
                  scrolling="auto"
                  width="100%"
                ></iframe>
              )}
              {lang === "it" && (
                <iframe
                  className={styles.iframe}
                  title="contact-iframe"
                  src="https://www.idealwine.biz/Tickets/ticketIt.php?ref=&fn=&ln=&em=&language=it"
                  frameBorder="0"
                  height="600"
                  scrolling="auto"
                  width="100%"
                ></iframe>
              )}
              {lang === "de" && (
                <iframe
                  className={styles.iframe}
                  title="contact-iframe"
                  src="https://www.idealwine.biz/Tickets/ticketDe.php?ref=&fn=&ln=&em=&language=de"
                  frameBorder="0"
                  height="600"
                  scrolling="auto"
                  width="100%"
                ></iframe>
              )}
            </div>
          ) : (
            <div className={styles.iframeBox}>
              {lang === "fr" && (
                <iframe
                  className={styles.iframe}
                  title="contact-iframe"
                  src={`https://www.idealwine.biz/Tickets/ticket.php?ref=${user.customerId}&fn=${firstName}&ln=${lastName}&em=${user.email}&language=fr`}
                  allowTransparency={true}
                  frameBorder="0"
                  height="600"
                  scrolling="auto"
                  width="60%"
                ></iframe>
              )}
              {lang === "en" && (
                <iframe
                  className={styles.iframe}
                  title="contact-iframe"
                  src={`https://www.idealwine.biz/Tickets/ticketUk.php?ref=${user.customerId}&fn=${firstName}&ln=${lastName}&em=${user.email}&language=en`}
                  allowTransparency={true}
                  frameBorder="0"
                  height="600"
                  scrolling="auto"
                  width="60%"
                ></iframe>
              )}
              {lang === "it" && (
                <iframe
                  className={styles.iframe}
                  title="contact-iframe"
                  src={`https://www.idealwine.biz/Tickets/ticketIt.php?ref=${user.customerId}&fn=${firstName}&ln=${lastName}&em=${user.email}&language=it`}
                  allowTransparency={true}
                  frameBorder="0"
                  height="600"
                  scrolling="auto"
                  width="60%"
                ></iframe>
              )}
              {lang === "de" && (
                <iframe
                  className={styles.iframe}
                  title="contact-iframe"
                  src={`https://www.idealwine.biz/Tickets/ticketDe.php?ref=${user.customerId}&fn=${firstName}&ln=${lastName}&em=${user.email}&language=de`}
                  allowTransparency={true}
                  frameBorder="0"
                  height="600"
                  scrolling="auto"
                  width="60%"
                ></iframe>
              )}
            </div>
          )}
          <strong>
            <p>{t("stillLookingForAnswer")}</p>
            <br />
            <p>{t("contactClient")}</p>
            <p>{t("clientServicePhoneNumber")}</p>
          </strong>
        </div>
      </div>
    </>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
