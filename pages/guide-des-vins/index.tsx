import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import clsx from "clsx";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import MiniMapButton from "@/components/molecules/MiniMapButton";
import Popover from "@/components/molecules/Popover";
import EstateSearch from "@/components/organisms/EstateSearch";
import { getEstateNamesCollectionQueryParams } from "@/components/organisms/EstateSearch/EstateSearch";
import InteractiveMap from "@/components/organisms/InteractiveMap";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { COUNTRIES_GDV, REGIONS } from "@/utils/constants";
import { DecoratedGetStaticProps, withCommonPagePropsDecorator } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t, lang } = useTranslation("guide-des-vins");
  const [openRegions, setOpenRegions] = useState(false);
  const [openCountries, setOpenCountries] = useState(false);

  useMountEffect(() => {
    sendGTMEvent({
      page: "guides_des_vins",
      pageChapter1: "edito",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.content}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.mapAndTextContent}>
        <div className={styles.leftDescription}>
          <h1 className={styles.title}>{t("title")}</h1>
          <Image
            src={"/arrow-in-a-circle.png"}
            className={clsx(styles.arrow, styles.standardMargin)}
            width={75}
            height={75}
            alt="Flèche"
          />
          <p className={styles.standardMargin}>{t("choose-a-region")}</p>
          <div className={clsx(styles.dropdowns, styles.standardMargin)}>
            <Popover
              open={openRegions}
              onOpenChange={setOpenRegions}
              trigger={
                <Button className={styles.button} variant="primaryGolden">
                  <span className={styles.buttonText}>{t("buttonsText.france")}</span>
                </Button>
              }
            >
              {Object.values(REGIONS).map(region => (
                <div className={styles.dropdownItem} key={region}>
                  <TranslatableLink
                    className={styles.link}
                    dontTranslate
                    href={getPlpUrl({ region: [region] }, lang)}
                  >
                    {t(`regions.name.${region}`)}
                  </TranslatableLink>
                </div>
              ))}
            </Popover>
            <Popover
              open={openCountries}
              onOpenChange={setOpenCountries}
              trigger={
                <Button className={styles.button} variant="secondaryGolden">
                  <span className={styles.buttonText}>{t("buttonsText.otherCountries")}</span>
                </Button>
              }
            >
              {Object.values(COUNTRIES_GDV).map(country => (
                <div className={styles.dropdownItem} key={country}>
                  <TranslatableLink
                    className={styles.link}
                    dontTranslate
                    href={getPlpUrl({ country: [country] }, lang)}
                  >
                    {t(`countries.name.${country}`)}
                  </TranslatableLink>
                </div>
              ))}
            </Popover>
          </div>
          <p className={clsx(styles.description, styles.standardMargin)}>{t("description1")}</p>
          <p className={clsx(styles.description, styles.standardMargin)}>{t("description2")}</p>
        </div>
        <div className={styles.wineMaps}>
          <InteractiveMap locale={lang} />
          <div className={styles.miniMaps}>
            <MiniMapButton
              country={COUNTRIES_GDV.ITALIE}
              imageSrc="/countriesSVG/italy.svg"
              imageAlt={t("countries.ITALIE")}
            />
            <MiniMapButton
              country={COUNTRIES_GDV.PORTUGAL}
              imageSrc="/countriesSVG/portugal.svg"
              imageAlt={t("countries.PORTUGAL")}
            />
            <MiniMapButton
              country={COUNTRIES_GDV.ESPAGNE}
              imageSrc="/countriesSVG/spain.svg"
              imageAlt={t("countries.ESPAGNE")}
            />
            <MiniMapButton
              country={COUNTRIES_GDV.HONGRIE}
              imageSrc="/countriesSVG/hungary.svg"
              imageAlt={t("countries.HONGRIE")}
            />
            <MiniMapButton
              country={COUNTRIES_GDV.ETATS_UNIS}
              imageSrc="/countriesSVG/usa.svg"
              imageAlt={t("countries.ETATS_UNIS")}
            />
            <MiniMapButton
              country={COUNTRIES_GDV.AUSTRALIE}
              imageSrc="/countriesSVG/australia.svg"
              imageAlt={t("countries.AUSTRALIE")}
            />
          </div>
        </div>
      </div>
      <EstateSearch />
    </div>
  );
};

const getStaticPageProps: DecoratedGetStaticProps = async ({ queryClient }) => {
  await queryClient.fetchQuery(getEstateNamesCollectionQueryParams());

  return {
    props: {},
  };
};

export const getStaticProps = withCommonPagePropsDecorator(getStaticPageProps);

export default Page;
