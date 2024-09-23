import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { NextSeo } from "next-seo";

import LinkButton from "@/components/atoms/Button/LinkButton";
import ProductCard from "@/components/organisms/PLP/ProductCard";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = () => {
  const { t, lang } = useTranslation("wishlist");

  const { wishlist, isWishlistLoading } = useAuthenticatedUserContext();

  useMountEffect(() => {
    sendGTMEvent({
      page: "wishlist",
      pageChapter1: "espace_client",
      pageChapter2: "",
    });
  });

  return (
    <div className={styles.pageContainer}>
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      <div className={styles.messageContainer}>
        <h1>{t("wishlist")}</h1>
        {isWishlistLoading ? (
          <FontAwesomeIcon size="2x" icon={faSpinnerThird} spin />
        ) : (
          wishlist.size === 0 && (
            <div className={styles.emptyWishlistContainer}>
              <p>{t("empty")}</p>
              <LinkButton className={styles.limitedWidthButton} href="BUY_WINE_URL">
                {t("seeAll")}
              </LinkButton>
            </div>
          )
        )}
        <div className={styles.hitsList}>
          {Array.from(wishlist, ([, variant]) => variant).map(productVariant => (
            <ProductCard
              key={productVariant.id}
              // @ts-expect-error TODO: fix types
              product={{
                ...productVariant,
                bottleObservations: "",
                imageUrl: productVariant.imageUrl ?? `/_no_picture_${lang}.jpg`,
                isBio: productVariant.isBio ?? false,
                isNatural: productVariant.isNatural ?? false,
                isTripleA: productVariant.isTripleA ?? false,
                lotDiscountPercentage: 0,
                hasBids: productVariant.hasBids ?? false,
                woodenCase: productVariant.woodenCase ?? false,
                refundableVat: productVariant.refundableVat ?? false,
                hasDiscount: productVariant.hasDiscount ?? false,
                priceByCountry: productVariant.priceByCountry ?? {},
                originalPriceByCountry: productVariant.originalPriceByCountry ?? {},
                hasLotDiscount: productVariant.hasLotDiscount ?? false,
                isDirectPurchase: productVariant.isDirectPurchase ?? false,
                auctionCatalogStartDate: Date.now(),
                auctionCatalogEndDate: Date.now(),
                bidEndDate: Date.now(),
              }}
              className={styles.productCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
