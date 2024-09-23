import Image from "next/image";

import TranslatableLink from "@/components/atoms/TranslatableLink";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { useFindCustomsFeeRate } from "@/hooks/useFindCustomsFeeRate";
import { AuctionItemReadModelJsonldShopAuctionItemReadModelTopAdjudicationsRead } from "@/networking/sylius-api-client/.ts.schemas";
import { calculateFees } from "@/utils/FeesHandler";
import { generateRatingUrlUtils } from "@/utils/generateRatingUrlUtils";
import { buildPdpUrl } from "@/utils/getPdpUrl";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import Price from "../Price";
import TooltipCustom from "../Tooltip/Tooltip";
import styles from "./MostExpensiveWines.module.scss";

type Props = {
  index: number;
  wine: AuctionItemReadModelJsonldShopAuctionItemReadModelTopAdjudicationsRead;
};

const NUMBER_OF_BOTTLES = 1;

const MostExpensiveWines = ({ index, wine }: Props) => {
  const { t, lang } = useTranslation();

  const format = t("enums:formatWithoutCount.BOUTEILLE");

  const { currentDeliveryCountry: countryCode } = useCurrentDeliveryCountry();

  const customsFeeRate = useFindCustomsFeeRate(countryCode);

  const { allIncludedAmount } = calculateFees(
    wine.highestBid ?? 0,
    NUMBER_OF_BOTTLES,
    customsFeeRate,
  );

  const translatedColor =
    typeof wine.productVariantInAuctionCatalog?.productVariant?.product?.color === "string"
      ? t(
          `enums:color.${wine.productVariantInAuctionCatalog.productVariant.product.color}`,
        ).toLocaleLowerCase()
      : "";

  const translatedRegion = isNotNullNorUndefined(
    wine.productVariantInAuctionCatalog?.productVariant?.product?.region?.name,
  )
    ? t(
        `enums:region.${
          wine.productVariantInAuctionCatalog?.productVariant?.product?.region?.name ?? ""
        }`,
      )
    : "";

  const vintageYear = wine.productVariantInAuctionCatalog?.productVariant?.productVintage?.year;

  const { completeUrl } = generateRatingUrlUtils(
    wine.productVariantInAuctionCatalog?.productVariant?.productVintage?.code ?? "",
    format,
    translatedRegion,
    wine.productVariantInAuctionCatalog?.productVariant?.product?.appellation?.toString() ?? "",
    wine.productVariantInAuctionCatalog?.productVariant?.product?.estate?.name?.toString() ?? "",
    translatedColor,
    lang,
  );

  const date = new Date(wine.endDate ?? "");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const variant = wine.productVariantInAuctionCatalog?.productVariant;

  const url = isNotNullNorUndefined(variant) ? buildPdpUrl(variant, t, lang).url : "";

  return (
    <div className={styles.container}>
      <div className={styles.index}>{index + 1}</div>
      <div className={styles.infos}>
        <TranslatableLink dontTranslate href={url} className={styles.nameWithPrice}>
          <p className={styles.justifiedText}>
            {wine.productVariantInAuctionCatalog?.productVariant?.product?.name} ({translatedColor})
            | {vintageYear} <small className={styles.small}>({formattedDate})</small>
          </p>
          {isNotNullNorUndefined(wine.highestBid) && (
            <Price
              className={styles.price}
              dontDisplayCents
              size="normal"
              price={allIncludedAmount}
            />
          )}
        </TranslatableLink>
        <TooltipCustom
          trigger={
            <div className={styles.tooltipContainer}>
              <TranslatableLink href={completeUrl} dontTranslate className={styles.image}>
                <Image src={"/analyse.png"} alt={"Analysis icon"} width={40} height={35} />
              </TranslatableLink>
            </div>
          }
          contentProps={{ side: "bottom" }}
        >
          <span>
            {t("prix-vin:goToRatingPage", {
              productName: wine.productVariantInAuctionCatalog?.productVariant?.product?.name,
              vintageYear: vintageYear,
            })}
          </span>
        </TooltipCustom>
      </div>
    </div>
  );
};

export default MostExpensiveWines;
