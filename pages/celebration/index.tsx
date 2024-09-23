import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import Image from "next/image";

import LinkButton from "@/components/atoms/Button/LinkButton";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const IDEALWINE_CONTACT_FORM_URL_BASE = "https://idealwine.biz/Celebration/form.php?lang=";

const Page = () => {
  const { t, lang } = useTranslation("celebration");

  const idealwineContactFormUrl = `${IDEALWINE_CONTACT_FORM_URL_BASE}${lang}`;

  useMountEffect(() => {
    sendGTMEvent({
      page: "celebrations_et_mariage",
      pageChapter1: "services",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <section className={styles.container}>
        <div className={styles.firstPartContainer}>
          <div className={styles.firstPartLeft}>
            <h1 className={styles.firstPartTitle}>{t("firstPartTitle")}</h1>
            <h2 className={styles.firstPartSubtitle}>{t("firstPartSubtitle")}</h2>
            <LinkButton
              variant="secondaryGolden"
              className={styles.firstPartContact}
              href={idealwineContactFormUrl}
              target="_blank"
              dontTranslate={true}
            >
              {t("contact")}
            </LinkButton>
          </div>
          <div className={styles.firstPartRight}>
            <Image
              className={styles.firstPartImage}
              src="/celebration-1.jpg"
              alt={t("idealwineCelebration")}
              width={650}
              height={395}
              layout="responsive"
            />
          </div>
        </div>
        <p className={styles.firstPartDescription}>{t("firstPartDescription")}</p>
      </section>
      <section className={styles.secondPartImageContainer}>
        <Image
          src="/celebration-2.jpg"
          alt={t("idealwineCelebration")}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
        <div className={styles.secondPartContainer}>
          <div>
            <p className={styles.secondPartTitle}>{t("secondPartTitleTop")}</p>
            <p className={styles.secondPartDescription}>{t("secondPartDescriptionTop")}</p>
          </div>
          <div>
            <p className={styles.secondPartSeparator}>&</p>
          </div>
          <div>
            <p className={styles.secondPartTitle}>{t("secondPartTitleBottom")}</p>
            <p className={styles.secondPartDescription}>{t("secondPartDescriptionBottom")}</p>
          </div>
          <LinkButton
            variant="secondaryGolden"
            className={styles.secondPartContact}
            href={idealwineContactFormUrl}
            target="_blank"
            dontTranslate={true}
          >
            {t("contact")}
          </LinkButton>
          <div>
            <p className={styles.secondPartInfo}>
              {`${t("customerService")} `}
              <a className={styles.email} href={`mailto:${t("customerServiceEmail")}`}>
                {t("customerServiceEmail")}
              </a>
            </p>
            <p className={styles.secondPartInfo}>{t("telephone")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
