import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import DOMPurify from "isomorphic-dompurify";
import { NextSeo } from "next-seo";

import Button from "@/components/atoms/Button";
import LinkButton from "@/components/atoms/Button/LinkButton";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t } = useTranslation("idealwine-conseil-3");

  useMountEffect(() => {
    sendGTMEvent({
      page: "placement_vin",
      pageChapter1: "cotation_des_vins",
      pageChapter2: "",
    });
  });

  return (
    <div>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />

      <div className={styles.wrapper}>
        <div className={styles.contentbg}>
          <div className={styles.content1}>
            <div>
              <h1 className={styles.h1}>
                {t("h1")}
                <br></br>
                {t("h1-2")}
              </h1>
              <h2 className={styles.h2}>{t("h4")}</h2>
            </div>
            <div className={styles.btnspace}>
              <TranslatableLink href={t("LinkBarometre")} dontTranslate>
                <Button variant="primaryGolden">{t("btn1")}</Button>
              </TranslatableLink>

              <a href="#newsletter" title="newsletter idealwine">
                <Button variant="primaryBlack">{t("btn3")}</Button>
              </a>

              <LinkButton href="AUCTION_REPORT_MONTHLY" variant="primaryGolden">
                {t("btn4")}
              </LinkButton>
            </div>

            <div>
              <h2
                className={styles.h2}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("t1")) }}
              />
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("p1")) }}></p>
            </div>

            <div>
              <h2
                className={styles.h2}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("t2")) }}
              />

              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("p2")) }}></p>
            </div>
          </div>
        </div>

        <div className={styles.content2}>
          <h2
            className={styles.h2}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t("h2-10-conseil")) }}
          />
          <div className={styles.olcontent}>
            <ol className={styles.ol}>
              <li>{t("li-1")}</li>
              <li>{t("li-2")}</li>
              <li>{t("li-3")}</li>
              <li>{t("li-4")}</li>
              <li>{t("li-5")}</li>
              <li>{t("li-6")}</li>
              <li>{t("li-7")}</li>
              <li>{t("li-8")}</li>
              <li>{t("li-9")}</li>
              <li>{t("li-10")}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
