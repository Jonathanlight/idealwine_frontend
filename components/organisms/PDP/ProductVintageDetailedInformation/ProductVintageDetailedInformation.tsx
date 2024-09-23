import DOMPurify from "isomorphic-dompurify";
import Trans from "next-translate/Trans";

import GoldenSeparator from "@/components/atoms/GoldenSeparator";
import { Size } from "@/components/atoms/GoldenSeparator/GoldenSeparator";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import ProductVariantDetailedCharacteristics from "@/components/organisms/PDP/ProductVariantDetailedCharacteristics";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { getVariantVintageTitle } from "@/domain/productVariant";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyString } from "@/utils/ts-utils";

import styles from "./ProductVintageDetailedInformation.module.scss";

export const ProductVintageDetailedInformation = ({
  productVariant,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
}): JSX.Element => {
  const { t, lang } = useTranslation("acheter-vin");
  const subtitle = getVariantVintageTitle(productVariant);

  const description = productVariant.product?.description;
  const estateDescription = productVariant.product?.estate?.description;
  const estateLink = productVariant.product?.estate?.externalURL;
  const estateName = productVariant.product?.estate?.name;

  return (
    <div id="detailed-informations-section" className={styles.container}>
      <h2 className={styles.title}>{t(`detailedInformation.title`)}</h2>
      <h3 className={styles.subtitle}>{subtitle}</h3>
      <GoldenSeparator size={Size.small} />
      {isNonEmptyString(description) && (
        <>
          <h4 className={styles.sectionTitle}>{t(`detailedInformation.variantSectionTitle`)}</h4>
          <p
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
          />
        </>
      )}
      {isNonEmptyString(estateDescription) && isNonEmptyString(estateName) && (
        <>
          <h4 className={styles.sectionTitle}>
            <TranslatableLink
              dontTranslate
              href={getPlpUrl({ domainName: [estateName] }, lang)}
              className={styles.estateLink}
            >
              {`${t(`detailedInformation.estateSectionTitle`)} ${estateName}`}
            </TranslatableLink>
          </h4>
          <p
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(estateDescription) }}
          />
          {isNonEmptyString(estateLink) ? (
            <p>
              <Trans
                ns="acheter-vin"
                i18nKey="detailedInformation.estateExternalLink"
                components={[
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
                    key={estateLink}
                    href={estateLink}
                    target="_blank"
                    className={styles.estateLink}
                    rel="noreferrer"
                  />,
                ]}
              />
            </p>
          ) : null}
        </>
      )}
      <h4 className={styles.sectionTitle}>
        {t(`detailedInformation.characteristicsSectionTitle`)}
      </h4>
      <ProductVariantDetailedCharacteristics productVariant={productVariant} />
    </div>
  );
};

export default ProductVintageDetailedInformation;
