import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

import { EstateJsonldShopEstateRead } from "@/networking/sylius-api-client/.ts.schemas";
import { replaceImageBaseUrlWithOriginal } from "@/utils/imageUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyString, isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./WeeklyEstate.module.scss";

type Props = {
  estate: EstateJsonldShopEstateRead;
};

const WeeklyEstate = ({ estate }: Props) => {
  const { t } = useTranslation("acheter-du-vin");

  return (
    <div className={styles.container}>
      <Image
        src={"/estateBackground.jpg"}
        alt="Photo d'arrière plan en noir et blanc montrant la lumière du soleil à travers des vignes"
        fill
        className={clsx(styles.backgroundImage, styles.image)}
      />
      <div className={styles.textContainer}>
        <h2 className={styles.title}>{t("estate.weeklyEstate.title")}</h2>
        <h3 className={styles.name}>{estate.name}</h3>
        <div className={styles.separator} />
        {isNotNullNorUndefined(estate.shortDescription) && (
          <p
            className={styles.shortDescription}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(estate.shortDescription) }}
          />
        )}
      </div>
      <div className={styles.imagesContainer}>
        {isNonEmptyString(estate.mainImageBrowserPath) && (
          <Image
            src={replaceImageBaseUrlWithOriginal(estate.mainImageBrowserPath)}
            alt={"Photo principale du domaine"}
            fill
            className={styles.image}
          />
        )}
        {isNonEmptyString(estate.logoImageBrowserPath) && (
          <div className={styles.logoImageContainer}>
            <Image
              src={replaceImageBaseUrlWithOriginal(estate.logoImageBrowserPath)}
              alt={"Photo du logo du domaine"}
              fill
              className={styles.image}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyEstate;
