import { OrderJsonldShopOrderRead } from "@/networking/sylius-api-client/.ts.schemas";

// NOTE: override the configuration type because Sylius creates a `mixed` type for the configuration
// but we receive `{slice: number, slice1: number}` from the backend
interface Method {
  configuration: {
    slice: number;
    slice1: number;
  };
}

interface Shipment {
  method: Method;
}

export interface CartWithShippingMethodConfiguration
  extends Omit<OrderJsonldShopOrderRead, "shipments"> {
  shipments: Shipment[];
}
