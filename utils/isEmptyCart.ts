import { OrderJsonldShopCartRead } from "@/networking/sylius-api-client/.ts.schemas";

export const isEmptyCart = (cart: OrderJsonldShopCartRead | undefined) => {
  const numberOfGroupedOrders = cart?.groupedOrders?.length ?? 0;

  return (cart?.items?.length ?? 0) + numberOfGroupedOrders === 0;
};
