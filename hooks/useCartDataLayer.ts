import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";

import { OrderJsonldShopCartRead } from "@/networking/sylius-api-client/.ts.schemas";
import { centsToUnits } from "@/utils/formatHandler";

type Props = {
  cart: OrderJsonldShopCartRead;
};
const useCartDataLayer = ({ cart }: Props) => {
  useMountEffect(() => {
    sendGTMEvent({ ecommerce: null });
    sendGTMEvent({
      event: "cartDisplay",
      ecommerce: {
        cartId: cart.tokenValue,
        cartCurrency: cart.currencyCode ?? "",
        cartTurnoverTTC: centsToUnits(cart.itemsTotal ?? 0),
        cartTurnoverTaxFree: cart.items?.reduce((total, cartItem) => {
          return (
            total +
            (cartItem.variant.priceByCountry
              ? centsToUnits(cartItem.variant.priceByCountry["JP"])
              : centsToUnits(cartItem.unitPrice ?? 0)) *
              (cartItem.quantity ?? 1)
          );
        }, 0),
        cartQuantity: cart.items?.reduce((count, cartItem) => {
          count += (cartItem.variant.numberOfBottles ?? 0) * (cartItem.quantity ?? 1);

          return count;
        }, 0),
        cartDistinctProduct: cart.items?.reduce((count, cartItem) => {
          if (!count.includes(cartItem.variant.code)) {
            count.push(cartItem.variant.code);
          }

          return count;
        }, [] as string[]).length,
      },
    });
  });
};

export const CartDataLayer = ({ cart }: Props) => {
  useCartDataLayer({ cart });

  return null;
};
