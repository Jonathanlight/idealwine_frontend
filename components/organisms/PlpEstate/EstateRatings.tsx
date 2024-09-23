import Trans from "next-translate/Trans";

import LinkButton from "@/components/atoms/Button/LinkButton";
import Price from "@/components/molecules/Price";
import { GetProductVintageRatingReadModelCollection200 } from "@/networking/sylius-api-client/.ts.schemas";
import { generateRatingUrlUtils } from "@/utils/generateRatingUrlUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./EstateRatings.module.scss";

type Props = {
  estateRatings: GetProductVintageRatingReadModelCollection200;
  estateName: string;
};

const EstateRatings = ({ estateRatings, estateName }: Props) => {
  const { t, lang } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Trans
          ns="prix-vin"
          i18nKey="estateRatings"
          components={{ strong: <strong /> }}
          values={{ estateName: estateName }}
        />
      </div>
      <ul className={styles.ratingsList}>
        {estateRatings["hydra:member"]
          .filter(rating => isNotNullNorUndefined(rating.value))
          .map((rating, index) => {
            const productVintageCode = rating.productVintage?.code;
            const regionName =
              rating.productVintage?.product?.region?.name !== undefined
                ? t(`enums:region.${rating.productVintage.product.region.name}`)
                : "";
            const productAppellation = rating.productVintage?.product?.appellation;
            const format = t("enums:formatWithoutCount.BOUTEILLE");
            const color =
              typeof rating.productVintage?.product?.color === "string"
                ? t(`enums:color.${rating.productVintage.product.color}`).toLocaleLowerCase()
                : "";

            const { completeUrl } = generateRatingUrlUtils(
              productVintageCode ?? "",
              format,
              regionName,
              productAppellation?.toString() ?? "",
              estateName.toString(),
              color,
              lang,
            );

            return (
              <li key={index}>
                <LinkButton
                  variant="inline"
                  href={completeUrl}
                  className={styles.rating}
                  dontTranslate
                >
                  <span>
                    {rating.productVintage?.product?.name} {rating.productVintage?.year}
                  </span>
                  <Price price={rating.value ?? 0} size="small" dontDisplayCents={true} />
                </LinkButton>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default EstateRatings;
