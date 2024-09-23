import { createContext, useContext } from "react";

import {
  AuctionAlertJsonldShopAuctionAlertRead,
  IndexedProductVariantDTOJsonldShopWishlistRead,
  OrderJsonldShopCartRead,
} from "@/networking/sylius-api-client/.ts.schemas";

import { AuthenticatedUser } from "./AuthenticatedUser";

interface IAuthenticatedUser {
  user?: AuthenticatedUser | null; // null = not initialized, undefined = initialized but not logged in
  cart?: OrderJsonldShopCartRead;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  setIsSignupModalOpen: (open: boolean) => void;
  setIsForgotPasswordModalOpen: (open: boolean) => void;
  setIsResendMailValidationModalOpen: (open: boolean) => void;
  setEmailToBeValidated: (email: string) => void;
  fetchCart: () => Promise<OrderJsonldShopCartRead | undefined>;
  numberOfOngoingBids?: number;
  setNumberOfOngoingBids: (numberOfOngoingBids: number) => void;
  setCart: (cart: OrderJsonldShopCartRead) => void;
  isFetchCartLoading: boolean;
  wishlist: Map<string, IndexedProductVariantDTOJsonldShopWishlistRead>;
  isWishlistLoading: boolean;
  auctionAlerts: Map<string, AuctionAlertJsonldShopAuctionAlertRead>;
  numberOfNonPaidOrders: number;
  setNumberOfNonPaidOrders: (numberOfNonPaidOrders: number) => void;
}

export const authenticatedUserContext = createContext<IAuthenticatedUser>({
  isLoginModalOpen: false,
  setIsLoginModalOpen: () => {},
  setIsSignupModalOpen: () => {},
  setIsForgotPasswordModalOpen: () => {},
  setIsResendMailValidationModalOpen: () => {},
  setEmailToBeValidated: () => {},
  // eslint-disable-next-line @typescript-eslint/require-await
  fetchCart: async () => undefined,
  setCart: () => {},
  setNumberOfOngoingBids: () => {},
  isFetchCartLoading: false,
  wishlist: new Map(),
  isWishlistLoading: false,
  auctionAlerts: new Map(),
  setNumberOfNonPaidOrders: () => {},
  numberOfNonPaidOrders: 0,
});

export const useAuthenticatedUserContext = () => useContext(authenticatedUserContext);
