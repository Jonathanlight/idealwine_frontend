import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import { ProductVariantShopSimilarProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import SimilarProduct from "../SimilarProducts/SimilarProduct";
import styles from "./SimilarProductVariantCaroussel.module.scss";

type Props = {
  similarVariants: ProductVariantShopSimilarProductVariantRead[];
};

const SimilarProductVariantCaroussel = ({ similarVariants }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-vin");

  return (
    <div className={styles.similarVariantsContainer}>
      <h1 className={styles.similarVariantsTitle}>
        {t("acheter-vin:similarVariants")}
        <GoldenUnderlineTitle size="large" />
      </h1>
      <div className={styles.similarVariants}>
        {similarVariants.map((variant: ProductVariantShopSimilarProductVariantRead) => (
          <SimilarProduct
            key={variant.code}
            product={variant}
            preloadPicture={true}
            className={styles.similarVariantsCard}
          />
        ))}
      </div>
    </div>
  );
};

export default SimilarProductVariantCaroussel;
