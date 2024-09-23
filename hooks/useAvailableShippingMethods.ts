import { useQuery } from "@tanstack/react-query";

import {
  OrderJsonldShopCartRead,
  ShippingMethodJsonldShopShippingMethodRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  getShopGetShippingMethodCollectionQueryKey,
  shopGetShippingMethodCollection,
} from "@/networking/sylius-api-client/shipping-method/shipping-method";
import { SHIPPING_METHODS } from "@/utils/constants";
import { nextLangToSyliusLocale } from "@/utils/locale";

type AvailableMethods = [string, ShippingMethodJsonldShopShippingMethodRead[] | undefined][];

export const useAvailableShippingMethods = (
  cart: OrderJsonldShopCartRead | undefined,
  lang: string,
) => {
  const params = {
    shipmentId: cart?.shipments?.[0]?.id?.toString() ?? "0",
    tokenValue: cart?.tokenValue ?? "",
    visible: true,
  };
  const { data: shippingMethods, isLoading } = useQuery({
    enabled: !!cart,
    queryKey: getShopGetShippingMethodCollectionQueryKey(params),
    queryFn: () =>
      shopGetShippingMethodCollection(params, {
        headers: { "Accept-Language": nextLangToSyliusLocale(lang) },
      }),
  });

  const availableMethods: AvailableMethods = [];
  SHIPPING_METHODS.map(([categoryName, categoryShippingMethods]) => {
    availableMethods.push([
      categoryName,
      shippingMethods?.["hydra:member"]?.filter(method =>
        categoryShippingMethods?.includes(method.code),
      ),
    ]);
  });

  return { availableMethods, isLoading };
};
