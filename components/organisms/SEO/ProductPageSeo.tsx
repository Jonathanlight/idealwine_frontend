import { NextSeo, ProductJsonLd } from "next-seo";
import { useRouter } from "next/router";

import { IMAGE_WIDTH } from "@/components/organisms/PLP/ProductCard/ProductCard";
import { getVariantTitleAndQuantity, getVariantVintageTitle } from "@/domain/productVariant";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useGetAuctionItemDTOItem } from "@/networking/sylius-api-client/auction-item-dt-o/auction-item-dt-o";
import { centsToUnits } from "@/utils/formatHandler";
import { buildPdpUrl } from "@/utils/getPdpUrl";
import { useTranslation } from "@/utils/next-utils";
import { ProductVariantCarouselImage } from "@/utils/productVariantImage";
import {
  isNonEmptyString,
  isNotNullNorUndefined,
  isNullOrUndefined,
  isPositiveNumber,
} from "@/utils/ts-utils";

export const ProductPageSeo = ({
  productVariant,
  images,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
  images: ProductVariantCarouselImage[];
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const { t } = useTranslation();
  const { currentCurrency: currency } = useCurrentCurrency();
  const { data: auctionItem } = useGetAuctionItemDTOItem(
    productVariant.auction ? productVariant.code : "", // string is voluntary empty, it does not trigger a call
  );
  const { defaultLocale, locale } = useRouter();
  const name = getVariantVintageTitle(productVariant) ?? productVariant.product?.name ?? "";

  const metaTitle = t("acheter-vin:seo.nextseo.title", { name, code: productVariant.code });

  const numberOfBottlesWithFormat = isNonEmptyString(productVariant.format)
    ? t(`common:enum.format.${productVariant.format}`, {
        count: productVariant.numberOfBottles,
      })
    : "";
  const titleAndQuantity = getVariantTitleAndQuantity(numberOfBottlesWithFormat, name);

  const availableInSale =
    typeof auctionItem?.auctionCatalog?.id === "number"
      ? t("acheter-vin:seo.nextseo.availableInSale", {
          auctionCatalogId: auctionItem.auctionCatalog.id,
        })
      : "";

  const description = t("acheter-vin:seo.nextseo.description", {
    titleAndQuantity,
    region:
      typeof productVariant.product?.region?.name === "string"
        ? " - " + t(`enums:region.${productVariant.product.region.name}`)
        : "",
    code: productVariant.code,
    availableInSale,
  });

  const currentLocale = (locale ?? defaultLocale ?? "fr") as "fr" | "en" | "de" | "it";
  const relativeUrl = buildPdpUrl(productVariant, t, currentLocale).url;
  const url = `${baseUrl}${relativeUrl}`;

  const model = t("acheter-vin:seo.jsonld.model");

  const imagesWithAbsolutePath = images.map(({ path }) => ({
    path: !path.product_variant_medium.startsWith("http")
      ? `${baseUrl}${path.product_variant_medium}`
      : path.product_variant_medium,
  }));

  const auctionPrice = isNullOrUndefined(auctionItem?.highestBid)
    ? auctionItem?.reserveBid
    : auctionItem?.highestBid;
  const price = productVariant.auction ? auctionPrice : productVariant.price;

  return (
    <>
      <NextSeo
        title={metaTitle}
        additionalMetaTags={[
          {
            property: "type",
            content: t("acheter-vin:seo.nextseo.type"),
          },
        ]}
        description={description}
        canonical={url}
        twitter={{
          cardType: "summary_large_image",
          handle: "@iDealwine",
          site: "@iDealwine",
        }}
        openGraph={{
          url: url,
          title: metaTitle,
          description: description,
          images: imagesWithAbsolutePath.map(({ path }) => ({
            url: path,
            width: IMAGE_WIDTH,
            height: IMAGE_WIDTH * 1.334,
          })),
          locale: currentLocale,
        }}
      />
      <ProductJsonLd
        productName={name}
        images={imagesWithAbsolutePath.map(({ path }) => path)}
        color={
          typeof productVariant.product?.color === "string"
            ? t(`enums:color.${productVariant.product.color}`)
            : undefined
        }
        sku={productVariant.code}
        category={
          typeof productVariant.product?.region?.name === "string"
            ? t(`enums:region.${productVariant.product.region.name}`)
            : undefined
        }
        productionDate={productVariant.productVintage?.year?.toString() ?? undefined}
        description={description}
        model={model}
        url={url}
        brand={productVariant.product?.estate?.name}
        manufacturerName={productVariant.product?.owner ?? undefined}
        offers={{
          url: url,
          availability:
            isNotNullNorUndefined(productVariant.onHand) &&
            isNotNullNorUndefined(productVariant.onHold) &&
            isPositiveNumber(productVariant.onHand - productVariant.onHold)
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          priceCurrency: currency,
          price: isNullOrUndefined(price) ? undefined : centsToUnits(price),
          availabilityEnds: auctionItem?.endDate,
          priceValidUntil: auctionItem?.endDate,
          seller: { name: "iDealwine.com" },
        }}
      />
    </>
  );
};
