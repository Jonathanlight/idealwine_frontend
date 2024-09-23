import { ShippingMethodJsonldShopShippingMethodRead } from "@/networking/sylius-api-client/.ts.schemas";

// NOTE: override the configuration type because Sylius creates a `mixed` type for the configuration
// but we receive `{slice: number, slice1: number}` from the backend
export interface ShippingMethodRead
  extends Omit<ShippingMethodJsonldShopShippingMethodRead, "configuration"> {
  configuration: {
    slice: number;
    slice1: number;
  };
}
