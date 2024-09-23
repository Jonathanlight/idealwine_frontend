import { sendGTMEvent } from "@next/third-parties/google";
import { useMediaQuery, useMountEffect } from "@react-hookz/web";
import clsx from "clsx";
// eslint-disable-next-line no-restricted-imports
import { NextSeo } from "next-seo";
import { useEffect, useMemo, useState } from "react";

import Accordion from "@/components/molecules/Accordion";
import { Section } from "@/components/molecules/Accordion/Accordion";
import PartnerDomainCard from "@/components/molecules/PartnerDomainCard";
import {
  PartnerDomainByRegionDTOShopPartnerDomainWithRegionRead,
  PartnerDomainDTOShopPartnerDomainWithRegionRead,
  WineCountryJsonldShopProductVintageRatingInfoDtoReadName,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  getGetPartnerDomainByRegionDTOCollectionQueryKey,
  getPartnerDomainByRegionDTOCollection,
  useGetPartnerDomainByRegionDTOCollection,
} from "@/networking/sylius-api-client/partner-domain-by-region-dt-o/partner-domain-by-region-dt-o";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { DecoratedGetStaticProps, withCommonPagePropsDecorator } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyString, isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const isValidPartnerDomain = (
  domain: PartnerDomainDTOShopPartnerDomainWithRegionRead,
): domain is Required<PartnerDomainDTOShopPartnerDomainWithRegionRead> =>
  isNotNullNorUndefined(domain) && isNonEmptyString(domain.name);

const isValidSection = (section: Partial<Section> | null): section is Required<Section> =>
  section !== null &&
  isNotNullNorUndefined(section.title) &&
  isNotNullNorUndefined(section.content);

const Page = () => {
  const { t } = useTranslation("partenaires");
  const [preventCls, setPreventCls] = useState(true);

  const { data: partnerDomainsByRegions } = useGetPartnerDomainByRegionDTOCollection({
    query: { staleTime: STALE_TIME_HOUR },
  });

  const { sections, regions } = useMemo(() => {
    const getAccordionSectionFromRegionWithEstates = (
      regionWithEstates: PartnerDomainByRegionDTOShopPartnerDomainWithRegionRead,
    ) => {
      if (!isNonEmptyString(regionWithEstates.regionName)) {
        return null;
      }

      const regionName = t(`enums:region.${regionWithEstates.regionName}`);

      return {
        value: regionName,
        title: <span id={regionName}>{regionName}</span>,
        content: regionWithEstates.estates
          ?.filter(isValidPartnerDomain)
          .map((estate, index) => (
            <PartnerDomainCard
              key={estate.name}
              regionName={regionName}
              isRegion={
                regionWithEstates.regionName !==
                WineCountryJsonldShopProductVintageRatingInfoDtoReadName.AUTRES_PAYS
              }
              estate={estate}
              isWhite={index % 2 === 0}
            />
          )),
      };
    };

    const sectionsInMemo =
      partnerDomainsByRegions
        ?.map(getAccordionSectionFromRegionWithEstates)
        .filter(isValidSection) ?? null;

    const regionsInMemo = sectionsInMemo
      ?.map(section => section?.value)
      .filter(isNotNullNorUndefined);

    return { sections: sectionsInMemo, regions: regionsInMemo };
  }, [partnerDomainsByRegions, t]);

  const shouldOpenAllRegions = useMediaQuery("(min-width: 1024px)") && regions !== undefined;
  const [openSections, setOpenSections] = useState<string[]>(regions ?? []);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    if (shouldOpenAllRegions) {
      setOpenSections(regions);
    } else {
      setOpenSections([]);
    }
    setTimeout(() => setPreventCls(false), 400);
  }, [regions, shouldOpenAllRegions]);

  const handleRegionLinkClick = (region: string) => {
    if (!openSections.includes(region)) {
      setOpenSections([...openSections, region]);
    }
    setActiveLink(region);
  };

  const totalDomainCount = () => {
    let totalDomain = 0;

    if (sections && sections.length > 0) {
      sections.map(section => {
        totalDomain += section?.content?.length ?? 0;
      });
    }

    return totalDomain;
  };

  useMountEffect(() => {
    sendGTMEvent({
      page: "partenaires",
      pageChapter1: "edito",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.container}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={`${styles.menu} ${styles.scrollbarDomain}`}>
        <h1 className={styles.title}>{t("title", { totaldomain: totalDomainCount() })}</h1>

        <div className={styles.menuContent}>
          <div className={styles.linksContainer}>
            {regions?.map(region => (
              <a
                key={region}
                className={clsx(styles.regionLink, {
                  [styles.active]: activeLink === region,
                })}
                href={`#${region}`}
                onClick={() => handleRegionLinkClick(region)}
              >
                <span>{region}</span>
              </a>
            ))}
          </div>
          <p className={styles.text}>{t("text", { totaldomain: totalDomainCount() })}</p>
        </div>
      </div>
      {sections ? (
        <Accordion
          type="multiple"
          value={openSections}
          // @ts-expect-error setValue is incorrectly typed for multiple accordion
          setValue={setOpenSections}
          // @ts-expect-error sections have been filtered
          sections={sections}
          rootStyle={styles.accordionRoot}
          itemStyle={styles.accordionItem}
          headerStyle={styles.accordionHeader}
          triggerStyle={styles.accordionTrigger}
          chevronStyle={styles.accordionChevron}
          contentContainerStyle={clsx(styles.accordionContentContainer, {
            [styles.noHeight]: preventCls,
          })}
          contentStyle={styles.accordionContent}
        />
      ) : null}
    </div>
  );
};

const getStaticPageProps: DecoratedGetStaticProps = async ({ queryClient }) => {
  try {
    await queryClient.fetchQuery({
      queryKey: getGetPartnerDomainByRegionDTOCollectionQueryKey(),
      queryFn: () => getPartnerDomainByRegionDTOCollection(),
    });
  } catch {
    // an error occurred, the react query cache is not warmed up
  }

  return {
    props: {},
  };
};

export const getStaticProps = withCommonPagePropsDecorator(getStaticPageProps);

export default Page;
