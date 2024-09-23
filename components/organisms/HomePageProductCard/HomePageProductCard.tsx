import Image from "next/image";

import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price";
import {
  OrderEventHistoryJsonldShopOrderEventHistoryRead,
  ProductVariantJsonldShopProductVariantReadNewReleases,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import styles from "./HomePageProductCard.module.scss";

const IMAGE_WIDTH = 150;

type Props = {
  variant:
    | ProductVariantJsonldShopProductVariantReadNewReleases
    | OrderEventHistoryJsonldShopOrderEventHistoryRead;
  imageUrl?: string;
  auction?: boolean;
  name?: string;
  price?: number;
  preloadPicture: boolean;
};

const HomePageProductCard = ({
  variant,
  imageUrl,
  auction,
  name,
  price,
  preloadPicture,
}: Props): JSX.Element => {
  const { t, lang } = useTranslation("home");

  return (
    <PdpLink variant={variant} className={styles.linkToProduct}>
      <div className={styles.cardContainer}>
        <Image
          unoptimized
          src={imageUrl ?? `/_no_picture_${lang}.jpg`}
          alt="bottle of wine"
          width={IMAGE_WIDTH}
          height={IMAGE_WIDTH * 1.334}
          priority={preloadPicture}
        />
        <div className={styles.goldenSaleType}>{auction ? t("auction") : t("directPurchase")}</div>
        <div className={styles.textContainer}>
          <div className={styles.maxFiveLinesText}>{name}</div>
          <Price price={price ?? 0} size="normal" className={styles.boldPrice} />
        </div>
      </div>
    </PdpLink>
  );
};

export default HomePageProductCard;
