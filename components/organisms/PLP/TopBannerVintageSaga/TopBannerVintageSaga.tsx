import DOMPurify from "isomorphic-dompurify";
import { useMemo } from "react";

import { VintageSagaJsonldShopVintageSagaPlpRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import DetailedRating from "./DetailedRating";
import styles from "./TopBannerVintageSaga.module.scss";
type Props = {
  vintageSagas: VintageSagaJsonldShopVintageSagaPlpRead[];
  region: string[];
  vintage: string;
};

type RatingColor = {
  rating: string;
  color: string;
  subRegion?: string;
};

const getVintageSagaDescription = (
  vintageSagas: VintageSagaJsonldShopVintageSagaPlpRead[],
): { description: string; ratings: RatingColor[] } => {
  const ratings: RatingColor[] = [];
  if (vintageSagas.length === 0) {
    return {
      description: "",
      ratings: [],
    };
  }

  let description = "";

  if (
    vintageSagas.some(saga =>
      ["VALLEE_DU_RHONE_NORD", "VALLEE_DU_RHONE_SUD"].includes(saga.region ?? ""),
    )
  ) {
    const nordDescription =
      vintageSagas.find(saga => saga.region === "VALLEE_DU_RHONE_NORD")?.description ?? "";
    const sudDescription =
      vintageSagas.find(saga => saga.region === "VALLEE_DU_RHONE_SUD")?.description ?? "";
    description = nordDescription + sudDescription;
  } else {
    description = isNotNullNorUndefined(vintageSagas[0].description)
      ? vintageSagas[0].description
      : "";
  }

  vintageSagas.forEach(vintageSaga => {
    if (isNotNullNorUndefined(vintageSaga.rating)) {
      ratings.push({
        rating: String(vintageSaga.rating),
        color: vintageSaga.color ?? "",
        subRegion:
          vintageSaga.region === "VALLEE_DU_RHONE_NORD"
            ? "NORD"
            : vintageSaga.region === "VALLEE_DU_RHONE_SUD"
            ? "SUD"
            : undefined,
      });
    }
  });

  return {
    description: description,
    ratings: ratings,
  };
};

const TopBannerVintageSaga = ({ vintageSagas, region, vintage }: Props) => {
  const { t } = useTranslation("acheter-du-vin");
  const rhoneRegions = ["VALLEE_DU_RHONE_NORD", "VALLEE_DU_RHONE_SUD"];
  const translatedRegion = t(
    `enums:region.${rhoneRegions.every(r => region.includes(r)) ? "RHONE" : region[0]}`,
  );

  const { description, ratings } = useMemo(
    () => getVintageSagaDescription(vintageSagas),
    [vintageSagas],
  );

  return (
    <article className={styles.mainContainer}>
      <div className={styles.titleAndDescription}>
        <h2 className={styles.title}>
          {t("vintageSagaDescription", {
            region: translatedRegion,
            vintage: vintage,
          })}
        </h2>
        <p
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
        />
      </div>
      <div className={styles.notes}>
        <h2 className={styles.notesTitle}>Notes</h2>
        <div className={styles.notesContainer}>
          {ratings.map((rating, index) => (
            <DetailedRating
              key={index}
              rating={rating.rating}
              color={rating.color}
              subRegion={rating.subRegion}
            />
          ))}
        </div>
      </div>
    </article>
  );
};

export default TopBannerVintageSaga;
