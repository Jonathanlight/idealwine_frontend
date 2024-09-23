import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

import { EstateJsonldShopEstateRead } from "@/networking/sylius-api-client/.ts.schemas";
import { replaceImageBaseUrlWithOriginal } from "@/utils/imageUtils";
import { isNonEmptyArray, isNonEmptyString } from "@/utils/ts-utils";

import styles from "./EstateBannerImages.module.scss";

type Props = {
  estate: EstateJsonldShopEstateRead;
  displayShortDescription?: boolean;
};

const EstateBannerImages = ({ estate, displayShortDescription = false }: Props) => {
  return (
    <div className={styles.container}>
      <Image
        src={"/estateBackground.jpg"}
        alt="Photo d'arrière plan en noir et blanc montrant la lumière du soleil à travers des vignes"
        fill
        className={clsx(styles.backgroundImage, styles.image)}
      />
      {isNonEmptyArray(estate.bannerImageBrowserPaths) && (
        <div className={styles.bannerImagesContainer}>
          {estate.bannerImageBrowserPaths.map((path, index) => (
            <div key={path} className={styles.bannerImageContainer}>
              <Image
                src={replaceImageBaseUrlWithOriginal(path)}
                alt={`Photo du domaine ${index + 1} / ${
                  estate.bannerImageBrowserPaths?.length ?? "4"
                }`}
                fill
                className={clsx(styles.image)}
              />
            </div>
          ))}
        </div>
      )}
      <div className={styles.textContainer}>
        <h2 className={styles.estateName}>{estate.name}</h2>
        {displayShortDescription && isNonEmptyString(estate.shortDescription) && (
          <p
            className={clsx(styles.estateShortDescription, styles.estateDescription)}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(estate.shortDescription) }}
          />
        )}
        {isNonEmptyString(estate.description) && (
          <p
            className={styles.estateDescription}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(estate.description) }}
          />
        )}
      </div>
    </div>
  );
};

export default EstateBannerImages;
