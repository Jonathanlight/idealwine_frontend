import { OrderJsonldShopOrderReadSellType } from "@/networking/sylius-api-client/.ts.schemas";

import { sortOrdersBySellTypeDateAndCountry } from "./orderUtils";

describe("sortOrdersBySellTypeDateAndCountry", () => {
  it("should sort orders by most recent checkout date", () => {
    const mostRecentOrder = {
      checkoutCompletedAt: "2022-01-02T00:00:00+00:00",
    };
    const oldestOrder = {
      checkoutCompletedAt: "2022-01-01T00:00:00+00:00",
    };
    const orders = [oldestOrder, mostRecentOrder];

    const result = sortOrdersBySellTypeDateAndCountry(orders);

    expect(result).toEqual([mostRecentOrder, oldestOrder]);
  });

  it("should sort orders by country when checkout date is the same", () => {
    const frenchOrder = {
      checkoutCompletedAt: "2022-01-01T00:00:00+00:00",
      shippingAddress: {
        countryCode: "FR",
      },
    };
    const englishOrder = {
      checkoutCompletedAt: "2022-01-01T00:00:00+00:00",
      shippingAddress: {
        countryCode: "GB",
      },
    };

    const orders = [englishOrder, frenchOrder];

    const result = sortOrdersBySellTypeDateAndCountry(orders);

    expect(result).toEqual([frenchOrder, englishOrder]);
  });

  it("should sort orders by sell type when checkout date and country are the same", () => {
    const auctionOrder = {
      checkoutCompletedAt: "2022-01-01T00:00:00+00:00",
      shippingAddress: {
        countryCode: "FR",
      },
      sellType: OrderJsonldShopOrderReadSellType.AUCTION,
    };
    const directSaleOrder = {
      checkoutCompletedAt: "2022-01-01T00:00:00+00:00",
      shippingAddress: {
        countryCode: "FR",
      },
      sellType: OrderJsonldShopOrderReadSellType.DIRECT_SALE,
    };

    const orders = [directSaleOrder, auctionOrder];

    const result = sortOrdersBySellTypeDateAndCountry(orders);

    expect(result).toEqual([auctionOrder, directSaleOrder]);
  });
});
