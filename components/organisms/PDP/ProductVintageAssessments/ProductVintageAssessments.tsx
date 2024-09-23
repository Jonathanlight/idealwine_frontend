import { Quoted } from "@/components/organisms/PDP/ProductVintageAssessments/Quoted";
import { ProductVintageJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ProductVintageAssessments.module.scss";

export const ProductVintageAssessments = ({
  productVintage,
}: {
  productVintage?: ProductVintageJsonldShopProductVariantRead;
}): JSX.Element => {
  const { t } = useTranslation();

  if (
    productVintage === undefined ||
    ((productVintage.expertAssessment ?? "") === "" &&
      (productVintage.iDealWineAssessment ?? "") === "")
  ) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      {(productVintage.expertAssessment ?? "") !== "" && (
        <div className={styles.quoteContainer}>
          <div className={styles.title}>{t("acheter-vin:assessment.expert")}</div>
          <Quoted>{productVintage.expertAssessment}</Quoted>
        </div>
      )}
      {(productVintage.iDealWineAssessment ?? "") !== "" && (
        <div className={styles.quoteContainer}>
          <div className={styles.title}>{t("acheter-vin:assessment.idealWine")}</div>
          <Quoted>{productVintage.iDealWineAssessment}</Quoted>
        </div>
      )}
    </div>
  );
};

export default ProductVintageAssessments;
