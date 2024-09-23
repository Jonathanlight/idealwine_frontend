import { AuthenticatedUser } from "@/context/AuthenticatedUserContext";
import {
  CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram,
  CustomerJsonldShopCustomerReadXtraOrder,
} from "@/networking/sylius-api-client/.ts.schemas";

import { getCountryCode, isCountryCodeInUnitedKingdom } from "./countryUtils";

describe("getCountryCode", () => {
  it("should return the user's country code if it exists", () => {
    const user: AuthenticatedUser = {
      id: "1",
      customerId: "1",
      username: "test",
      countryCode: "US",
      roles: [],
      loyaltyProgram: CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.NONE,
      xtraOrder: CustomerJsonldShopCustomerReadXtraOrder.NO_XTRA_ORDER,
      hasSetupAddress: false,
      canSell: false,
      firstName: "John",
      lastName: "Doe",
      email: "jd@test.fr",
    };

    const currentDeliveryCountry = "FR";

    expect(getCountryCode(user, currentDeliveryCountry)).toEqual("US");
  });

  it("should return the current delivery country if the user's country code does not exist", () => {
    const currentDeliveryCountry = "FR";

    expect(getCountryCode(undefined, currentDeliveryCountry)).toEqual("FR");
    expect(getCountryCode(null, currentDeliveryCountry)).toEqual("FR");
  });

  it("should return the default delivery country if the user and the current delivery country do not exist", () => {
    expect(getCountryCode(undefined, undefined)).toEqual("FR");
  });
});

describe("isCountryCodeInUnitedKingdom", () => {
  it.each([
    [true, "UK"],
    [true, "GB"],
    [false, "FR"],
    [false, "DE"],
  ])("should return %s if the country code is %s", (expected, countryCode) => {
    expect(isCountryCodeInUnitedKingdom(countryCode)).toEqual(expected);
  });
});
