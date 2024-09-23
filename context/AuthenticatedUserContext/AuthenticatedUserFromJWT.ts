import {
  CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram,
  CustomerJsonldShopCustomerReadXtraOrder,
} from "@/networking/sylius-api-client/.ts.schemas";

export type AuthenticatedUserFromJWT = {
  iat: number;
  exp: number;
  roles: string[];
  username: string;
  id: number;
  customerId: number;
  countryCode: string | null;
  currencyCode: string | null;
  loyaltyProgram: CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram;
  xtraOrder: CustomerJsonldShopCustomerReadXtraOrder;
  hasSetupAddress: boolean;
  canSell: boolean;
  firstName: string;
  lastName: string;
  email: string;
  adminEmailImpersonatingUser?: string;
};
