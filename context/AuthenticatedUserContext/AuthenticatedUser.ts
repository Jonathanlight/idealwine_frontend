import {
  CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram,
  CustomerJsonldShopCustomerReadXtraOrder,
} from "@/networking/sylius-api-client/.ts.schemas";

import { AuthenticatedUserFromJWT } from "./AuthenticatedUserFromJWT";

export class AuthenticatedUser {
  constructor(userFromJwt: AuthenticatedUserFromJWT) {
    this.id = userFromJwt.id.toString();
    this.customerId = userFromJwt.customerId.toString();
    this.username = userFromJwt.username;
    this.countryCode = userFromJwt.countryCode ?? undefined;
    this.currencyCode = userFromJwt.currencyCode ?? undefined;
    this.roles = userFromJwt.roles;
    this.loyaltyProgram = userFromJwt.loyaltyProgram;
    this.xtraOrder = userFromJwt.xtraOrder;
    this.hasSetupAddress = userFromJwt.hasSetupAddress;
    this.canSell = userFromJwt.canSell;
    this.firstName = userFromJwt.firstName;
    this.lastName = userFromJwt.lastName;
    this.email = userFromJwt.email;
    this.adminEmailImpersonatingUser = userFromJwt.adminEmailImpersonatingUser;
  }

  static createFromJWTPayload(payload?: AuthenticatedUserFromJWT) {
    return payload === undefined ? undefined : new AuthenticatedUser(payload);
  }

  public readonly id: string;
  public readonly customerId: string;
  public readonly username: string;
  public readonly countryCode?: string;
  public readonly currencyCode?: string;
  public readonly roles: string[];
  public readonly loyaltyProgram: CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram;
  public readonly xtraOrder: CustomerJsonldShopCustomerReadXtraOrder;
  public readonly hasSetupAddress: boolean;
  public readonly canSell: boolean;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly adminEmailImpersonatingUser?: string;
}
