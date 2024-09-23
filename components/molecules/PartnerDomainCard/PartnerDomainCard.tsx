import clsx from "clsx";
import Image from "next/image";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { PartnerDomainDTOShopPartnerDomainWithRegionRead } from "@/networking/sylius-api-client/.ts.schemas";
import { replaceImageBaseUrlWithOriginal } from "@/utils/imageUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./PartnerDomainCard.module.scss";

type Props = {
  regionName: string;
  estate: Required<PartnerDomainDTOShopPartnerDomainWithRegionRead>;
  isWhite: boolean;
  isRegion: boolean;
};

const PartnerDomainCard = ({ regionName, estate, isWhite, isRegion }: Props) => {
  const { t, lang } = useTranslation("partenaires");

  const imageUrl =
    isNotNullNorUndefined(estate.imageBrowserPath) && "" !== estate.imageBrowserPath
      ? replaceImageBaseUrlWithOriginal(estate.imageBrowserPath)
      : "/estateMissingImage-400x216.jpeg";

  return (
    <TranslatableLink
      key={estate.name}
      href={getPlpUrl({ domainName: [estate.name] }, lang)}
      className={clsx(styles.container, {
        [styles.white]: isWhite,
      })}
      dontTranslate
    >
      <div className={styles.overlay}></div>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt={t("alt", { estateName: estate.name })}
        />
      </div>
      <h2 className={styles.estateName}>{estate.name}</h2>
      <small className={styles.regionName}>
        {isRegion ? regionName : t(`enums:country.${String(estate.countryName)}`)}
      </small>
    </TranslatableLink>
  );
};

export default PartnerDomainCard;
