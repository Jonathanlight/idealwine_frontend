import { OrderJsonldShopOrderRead } from "@/networking/sylius-api-client/.ts.schemas";

import { ORDER_PAYMENT_STATES, PAYMENT_METHOD_CODES } from "./constants";

export const hasPayLaterPaymentMethodCode = (order: OrderJsonldShopOrderRead): boolean => {
  return (
    order.payments?.some(payment => payment.method?.code === PAYMENT_METHOD_CODES.PAY_LATER) ??
    false
  );
};

export const isPaid = (order: OrderJsonldShopOrderRead): boolean => {
  return order.paymentState === ORDER_PAYMENT_STATES.PAID;
};

export const getPaidOrders = (orders: OrderJsonldShopOrderRead[]) =>
  orders.filter(order => isPaid(order));

export const getNonPaidOrders = (orders: OrderJsonldShopOrderRead[]) =>
  orders.filter(order => !isPaid(order) && hasPayLaterPaymentMethodCode(order));

export const getAwaitingPaymentOrders = (orders: OrderJsonldShopOrderRead[]) =>
  orders.filter(order => !isPaid(order) && !hasPayLaterPaymentMethodCode(order));

type OrderToSort = {
  checkoutCompletedAt?: string | null;
  sellType?: string;
  shippingAddress?: {
    countryCode?: string;
  } | null;
};

export const sortOrdersBySellTypeDateAndCountry = <T extends OrderToSort[]>(orders: T): T =>
  orders.sort((a, b) => {
    const aCheckoutCompletedAt = a.checkoutCompletedAt ?? "";
    const bCheckoutCompletedAt = b.checkoutCompletedAt ?? "";
    if (aCheckoutCompletedAt !== bCheckoutCompletedAt)
      return aCheckoutCompletedAt > bCheckoutCompletedAt ? -1 : 1;

    const aCountry = a.shippingAddress?.countryCode ?? "MissingCountryCode";
    const bCountry = b.shippingAddress?.countryCode ?? "MissingCountryCode";
    if (aCountry === bCountry) {
      return (a.sellType ?? "") > (b.sellType ?? "") ? 1 : -1;
    }

    return aCountry > bCountry ? 1 : -1;
  });
