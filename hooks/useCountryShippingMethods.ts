import { useShopGetByCountryShippingMethodCollection } from "@/networking/sylius-api-client/shipping-method/shipping-method";
import { ShippingMethodRead } from "@/types/ShippingMethods";
import { CATEGORIES, SHIPPING_METHODS } from "@/utils/constants";

type AvailableMethods = ShippingMethodRead[];

export const useCountryShippingMethods = (countryCode: string) => {
  const { data: shippingMethods, isLoading } = useShopGetByCountryShippingMethodCollection(
    countryCode,
    undefined,
    { query: { enabled: countryCode !== "" } },
  );

  const availableMethods: AvailableMethods = [];

  // Get the constant shipping methods codes that are available for home delivery
  const HOME_DELIVERY_SHIPPING_METHODS = SHIPPING_METHODS.find(SM =>
    SM.find(key => key === CATEGORIES.HOME_DELIVERY),
  )?.find(key => Array.isArray(key));

  if (!Array.isArray(HOME_DELIVERY_SHIPPING_METHODS)) return { availableMethods, isLoading };

  // Filter the backend shipping methods by the ones that are available for home delivery
  shippingMethods?.["hydra:member"]?.filter(method =>
    HOME_DELIVERY_SHIPPING_METHODS.find(code =>
      code === method.code
        ? availableMethods.push(method as unknown as ShippingMethodRead) // see note in `ShippingMethodRead` type definition
        : null,
    ),
  );

  return { availableMethods, isLoading };
};
