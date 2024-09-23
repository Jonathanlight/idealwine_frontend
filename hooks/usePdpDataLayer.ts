import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";

import { useGetVariantColorAndRegion, useGetVariantDescription } from "@/domain/productVariant";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useGetProductVariantToGtmEvent } from "@/utils/gtmUtils";

import { useCurrentCurrency } from "./useCurrentCurrency";

type Props = {
  variant: ProductVariantJsonldShopProductVariantRead;
};

const usePdpDataLayer = ({ variant }: Props) => {
  const { currentCurrency } = useCurrentCurrency();

  const variantDescription = useGetVariantDescription(variant);
  const colorAndRegion = useGetVariantColorAndRegion(variant);
  const { color, region } = colorAndRegion ?? {};

  const { variantGtmEvent } = useGetProductVariantToGtmEvent(
    variant,
    currentCurrency,
    variantDescription ?? "",
    region ?? "",
    color ?? "",
  );

  useMountEffect(() => {
    sendGTMEvent({ ecommerce: null });
    sendGTMEvent({
      event: "productPageDisplay",
      ecommerce: {
        products: [variantGtmEvent],
      },
    });
  });
};

export const PdpDataLayer = ({ variant }: Props) => {
  usePdpDataLayer({ variant });

  return null;
};
