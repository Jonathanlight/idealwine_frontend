import { sendGTMEvent } from "@next/third-parties/google";
import { Translate } from "next-translate";
import { useMemo } from "react";

import {
  OrderItemJsonldShopCartRead,
  OrderJsonldShopCartRead,
  ProductVariantJsonldShopProductVariantRead,
} from "@/networking/sylius-api-client/.ts.schemas";

import { CODE_TO_SHIPPING_METHOD, getGtmCategory2FromCategory } from "./constants";
import { centsToUnits } from "./formatHandler";
import { isNotNullNorUndefined } from "./ts-utils";

const getProductVariantToGtmEvent = (
  variant: ProductVariantJsonldShopProductVariantRead,
  currentCurrency: string,
  variantDescription: string,
  region: string,
  color: string,
) => {
  return {
    variantGtmEvent: {
      productId: variant.code,
      product: variantDescription,
      productVariant: variant.productVintage?.year,
      productBrand: variant.product?.owner,
      productDiscount: !variant.auction && (variant.price ?? 0) < (variant.originalPrice ?? 0),
      productPriceTTC: centsToUnits(variant.price ?? 0),
      // JP is an export zone so price is HT
      productTaxFree: variant.priceByCountry
        ? centsToUnits(variant.priceByCountry["JP"])
        : centsToUnits(variant.price ?? 0),
      product_currency: currentCurrency,
      productStock: variant.inStock,
      product_category1: variant.auction ? "enchere" : "e_caviste",
      product_category2: getGtmCategory2FromCategory(variant.product?.category),
      product_category3: region,
      product_category4: color,
    },
  };
};

export const useGetProductVariantToGtmEvent = (
  variant: ProductVariantJsonldShopProductVariantRead,
  currentCurrency: string,
  variantDescription: string,
  region: string,
  color: string,
) => {
  return useMemo(
    () => getProductVariantToGtmEvent(variant, currentCurrency, variantDescription, region, color),
    [variant, currentCurrency, variantDescription, region, color],
  );
};

export const sendBidGtmEvent = (
  productVariant: ProductVariantJsonldShopProductVariantRead,
  bidPrice: number,
  bidPriceComFree: number,
  currencyCode: string,
  bidId: number | null | undefined,
  type: "max" | "classique",
  t: Translate,
) => {
  sendGTMEvent({ ecommerce: null });
  sendGTMEvent({
    event: "bidRegistered",
    ecommerce: {
      bid_id: bidId,
      bid_won: false,
      bid_type: type,
      productId: productVariant.code,
      product: productVariant.name,
      productVariant: productVariant.productVintage?.year,
      productBrand: productVariant.product?.owner,
      bidPrice: centsToUnits(Math.round(bidPrice)),
      bidPriceComFree: centsToUnits(Math.round(bidPriceComFree)),
      product_currency: currencyCode,
      product_category1: "enchere",
      product_category2: getGtmCategory2FromCategory(productVariant.product?.category),
      product_category3: isNotNullNorUndefined(productVariant.product?.region?.name)
        ? t(`enums:region.${String(productVariant.product?.region?.name)}`).toLocaleLowerCase()
        : "",
      product_category4: isNotNullNorUndefined(productVariant.product?.color)
        ? t(`enums:color.${String(productVariant.product?.color)}`).toLocaleLowerCase()
        : "",
    },
  });
};

export const sendProductAddToCartGtmEvent = (
  newCart: OrderJsonldShopCartRead,
  deliveryCountry: string,
  t: Translate,
) => {
  sendGTMEvent({ ecommerce: null });
  sendGTMEvent({
    event: "productAddToCart",
    ecommerce: {
      products: newCart.items?.map(item => {
        const price = item.variant.priceByCountry?.[deliveryCountry] ?? 0;
        const originalPrice = item.variant.originalPriceByCountry?.[deliveryCountry] ?? 0;

        return {
          cartId: newCart.tokenValue,
          productId: item.variant.code,
          product: item.variant.product?.name,
          productVariant: item.variant.productVintage?.year,
          productBrand: item.variant.product?.owner,
          productDiscount: !item.variant.auction && price < originalPrice,
          productPriceTTC: centsToUnits(item.variant.priceByCountry?.[deliveryCountry] ?? 0),
          productTaxFree: item.variant.priceByCountry
            ? centsToUnits(item.variant.priceByCountry["JP"])
            : centsToUnits(price),
          product_currency: newCart.currencyCode ?? "",
          productStock: true, // always true because stock is checked before adding to cart
          product_category1: item.variant.auction ? "enchere" : "e_caviste",
          product_category2: getGtmCategory2FromCategory(item.variant.product?.category),
          product_category3: isNotNullNorUndefined(item.variant.product?.region?.name)
            ? t(`enums:region.${String(item.variant.product?.region?.name)}`).toLocaleLowerCase()
            : "",
          product_category4: isNotNullNorUndefined(item.variant.product?.color)
            ? t(`enums:color.${String(item.variant.product?.color)}`).toLocaleLowerCase()
            : "",
          productQuantity: item.quantity ?? 0,
        };
      }),
    },
  });
};

export const sendProductRemoveFromCartGtmEvent = (
  cart: OrderJsonldShopCartRead | undefined,
  cartItem: OrderItemJsonldShopCartRead | undefined,
  t: Translate,
) => {
  sendGTMEvent({ ecommerce: null });
  sendGTMEvent({
    event: "productRemoveFromCart",
    ecommerce: {
      cartId: cart?.tokenValue,
      productId: cartItem?.variant.code,
      product: cartItem?.variant.product?.name,
      productVariant: cartItem?.variant.productVintage?.year,
      productBrand: cartItem?.variant.product?.owner,
      productDiscount:
        !cartItem?.variant.auction &&
        (cartItem?.unitPrice ?? 0) < (cartItem?.originalUnitPrice ?? 0),
      productPriceTTC: centsToUnits(cartItem?.total ?? 0),
      productTaxFree: cartItem?.variant.priceByCountry
        ? centsToUnits(cartItem.variant.priceByCountry["JP"])
        : centsToUnits(cartItem?.total ?? 0),
      product_currency: cart?.currencyCode,
      productStock: true, // always true because stock is checked before adding to cart
      product_category1: cartItem?.variant.auction ? "enchere" : "e_caviste",
      product_category2: getGtmCategory2FromCategory(cartItem?.variant.product?.category),
      product_category3: isNotNullNorUndefined(cartItem?.variant.product?.region?.name)
        ? t(`enums:region.${String(cartItem?.variant.product?.region?.name)}`).toLocaleLowerCase()
        : "",
      product_category4: isNotNullNorUndefined(cartItem?.variant.product?.color)
        ? t(`enums:color.${String(cartItem?.variant.product?.color)}`).toLocaleLowerCase()
        : "",
      productQuantity: cartItem?.quantity ?? 0,
    },
  });
};

export const sendCartUpdateGtmEvent = (newCart?: OrderJsonldShopCartRead) => {
  sendGTMEvent({ ecommerce: null });
  sendGTMEvent({
    event: "cartUpdate",
    ecommerce: {
      cartId: newCart?.tokenValue,
      cartCurrency: newCart?.currencyCode ?? "",
      cartTurnoverTTC: centsToUnits(newCart?.itemsTotal ?? 0),
      cartTurnoverTaxFree: newCart?.items?.reduce((total, cartItem) => {
        return (
          total +
          (cartItem.variant.priceByCountry
            ? centsToUnits(cartItem.variant.priceByCountry["JP"])
            : centsToUnits(cartItem.unitPrice ?? 0)) *
            (cartItem.quantity ?? 1)
        );
      }, 0),
      cartQuantity: newCart?.items?.reduce((count, cartItem) => {
        count += (cartItem.variant.numberOfBottles ?? 0) * (cartItem.quantity ?? 1);

        return count;
      }, 0),
      cartDistinctProduct: newCart?.items?.reduce((count, cartItem) => {
        if (!count.includes(cartItem.variant.code)) {
          count.push(cartItem.variant.code);
        }

        return count;
      }, [] as string[]).length,
    },
  });
};

export const sendCartDeliveryGtmEvent = (newCart?: OrderJsonldShopCartRead) => {
  sendGTMEvent({ ecommerce: null });
  const shippingMethodCode = newCart?.shipments?.[0]?.method?.code;
  sendGTMEvent({
    event: "CartDelivery",
    ecommerce: {
      cartId: newCart?.tokenValue,
      cartCurrency: newCart?.currencyCode ?? "",
      cartTurnoverTTC: centsToUnits(newCart?.itemsTotal ?? 0),
      cartTurnoverTaxFree: newCart?.items?.reduce((total, cartItem) => {
        return (
          total +
          (cartItem.variant.priceByCountry
            ? centsToUnits(cartItem.variant.priceByCountry["JP"])
            : centsToUnits(cartItem.unitPrice ?? 0)) *
            (cartItem.quantity ?? 1)
        );
      }, 0),
      cartQuantity: newCart?.items?.reduce((count, cartItem) => {
        count += (cartItem.variant.numberOfBottles ?? 0) * (cartItem.quantity ?? 1);

        return count;
      }, 0),
      cartDistinctProduct: newCart?.items?.reduce((count, cartItem) => {
        if (!count.includes(cartItem.variant.code)) {
          count.push(cartItem.variant.code);
        }

        return count;
      }, [] as string[]).length,

      ShippingCostTTC: (newCart?.shippingTotal ?? 0) / 100,
      ShippingCostTaxFree: (newCart?.shippingTotalWithoutTaxes ?? 0) / 100,
      shippingDelivery:
        shippingMethodCode !== undefined ? CODE_TO_SHIPPING_METHOD[shippingMethodCode] : undefined,
    },
  });
};

export const sendCartPaymentGtmEvent = (newCart?: OrderJsonldShopCartRead) => {
  sendGTMEvent({ ecommerce: null });
  const shippingMethodCode = newCart?.shipments?.[0]?.method?.code;
  sendGTMEvent({
    event: "CartPayment",
    ecommerce: {
      cartId: newCart?.tokenValue,
      cartCurrency: newCart?.currencyCode ?? "",
      cartTurnoverTTC: centsToUnits(newCart?.itemsTotal ?? 0),
      cartTurnoverTaxFree: newCart?.items?.reduce((total, cartItem) => {
        return (
          total +
          (cartItem.variant.priceByCountry
            ? centsToUnits(cartItem.variant.priceByCountry["JP"])
            : centsToUnits(cartItem.unitPrice ?? 0)) *
            (cartItem.quantity ?? 1)
        );
      }, 0),
      cartQuantity: newCart?.items?.reduce((count, cartItem) => {
        count += (cartItem.variant.numberOfBottles ?? 0) * (cartItem.quantity ?? 1);

        return count;
      }, 0),
      cartDistinctProduct: newCart?.items?.reduce((count, cartItem) => {
        if (!count.includes(cartItem.variant.code)) {
          count.push(cartItem.variant.code);
        }

        return count;
      }, [] as string[]).length,

      shippingCostTTC: (newCart?.shippingTotal ?? 0) / 100,
      shippingCostTaxFree: (newCart?.shippingTotalWithoutTaxes ?? 0) / 100,
      shippingDelivery:
        shippingMethodCode !== undefined ? CODE_TO_SHIPPING_METHOD[shippingMethodCode] : undefined,
      paymentMode: newCart?.payments?.[0]?.method?.code,
    },
  });
};
