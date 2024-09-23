import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import Accordion from "@/components/molecules/Accordion";
import { Section } from "@/components/molecules/Accordion/Accordion";
import { HelpPageBreadcrumb } from "@/components/organisms/Breadcrumb/HelpPageBreadcrumb";
import CalculateShippingForm from "@/components/organisms/CalculateShippingForm/CalculateShippingForm";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { DOZEN_BOTTLES_DELIVERY_COST, DUTY_AND_CUSTOMS_COST } from "@/utils/constants";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { getDeliveryConditions } from "@/utils/getDeliveryConditions";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

type Sections = Section[];

const Page = () => {
  const { t } = useTranslation("garanties-idealwine");
  const [country, setCountry] = useState("");

  const moreInfoSections: Sections = Object.values(
    t("moreInfo", undefined, {
      returnObjects: true,
      default: [],
    }),
  );
  const { convertToActiveCurrency } = useCurrencyConverter();
  const { currentCurrencyLogo } = useCurrentCurrency();

  const deliveryConditions = getDeliveryConditions(country, t, {
    dozenBottlesDeliveryCost: DOZEN_BOTTLES_DELIVERY_COST.toString() + "€",
    dozenBottlesDeliveryCostInActiveCurrency:
      convertToActiveCurrency(DOZEN_BOTTLES_DELIVERY_COST).convertedPrice.toFixed(2) +
      currentCurrencyLogo,
    dutyAndCustomsCost: DUTY_AND_CUSTOMS_COST.toString() + "€",
    dutyAndCustomsCostInActiveCurrency:
      convertToActiveCurrency(DUTY_AND_CUSTOMS_COST).convertedPrice.toFixed(2) +
      currentCurrencyLogo,
  });

  useMountEffect(() => {
    sendGTMEvent({
      page: "garanties_idealwine",
      pageChapter1: "aide",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.page}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <HelpPageBreadcrumb
        translatedLinkName="DELIVERY_FEES_URL"
        helpTab={t("idealwineGuarantees")}
      />
      <section>
        <h1 className={styles.title}>{t("title")}</h1>
        <div className={styles.separatorContainer}>
          <hr className={styles.separator}></hr>
        </div>
        <p className={styles.subtitle}>{t("subtitle")}</p>
        <CalculateShippingForm onCountryChange={setCountry} />
        <div className={styles.formInfo}>
          <p className={styles.formInfoBottles}>{t("formInfoBottles")}</p>
          <p>{deliveryConditions}</p>
        </div>
      </section>
      <section className={styles.guaranteesContainer}>
        <Image
          src="/bg-garanties.jpg"
          alt={t("idealwineGuarantees")}
          layout="fill"
          objectFit="cover"
          objectPosition="left"
        />
        <div className={styles.guaranteesContent}>
          <h2 className={styles.guaranteesTitle}>{t("guaranteesTitle")}</h2>
          <p className={styles.guaranteesParagraph}>{t("guaranteesFirstParagraph")}</p>
          <p className={styles.guaranteesParagraph}>{t("guaranteesSecondParagraph")}</p>
        </div>
      </section>
      <section className={styles.moreInfoContainer}>
        <p className={styles.moreInfoTitle}>{t("moreInfoTitle")}</p>
        <div className={styles.accordion}>
          <Accordion
            type="multiple"
            sections={moreInfoSections}
            itemStyle={styles.accordionItem}
            headerStyle={styles.accordionHeader}
            triggerStyle={styles.accordionTrigger}
            contentContainerStyle={styles.accordionContentContainer}
          />
        </div>
      </section>
      <section>
        <p className={styles.moreQuestions}>
          {t("moreQuestions")}{" "}
          <TranslatableLink href="FAQ_URL" className={styles.helpLink}>
            {t("help")}
          </TranslatableLink>
        </p>
      </section>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
