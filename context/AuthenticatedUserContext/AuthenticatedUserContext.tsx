import { useSessionStorageValue, useUpdateEffect } from "@react-hookz/web";
import { useQueryClient } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import dynamic from "next/dynamic";
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import { useAccessToken } from "@/hooks/useAccessToken";
import {
  AuctionAlertJsonldShopAuctionAlertRead,
  GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionParams,
  IndexedProductVariantDTOJsonldShopWishlistRead,
  OrderJsonldShopCartRead,
  ShippingMethodJsonldShopOrderReadCode,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useGetAuctionAlertCollection } from "@/networking/sylius-api-client/auction-alert/auction-alert";
import {
  getGetCustomerAuctionItemsCustomerAuctionItemDTOCollectionQueryKey,
  useGetCustomerAuctionItemsCustomerAuctionItemDTOCollection,
} from "@/networking/sylius-api-client/customer-auction-item-dt-o/customer-auction-item-dt-o";
import { useShopGetWishlistCustomerItem } from "@/networking/sylius-api-client/customer/customer";
import {
  useShopGetOrderCollection,
  useShopPostOrderCollection,
} from "@/networking/sylius-api-client/order/order";
import { ORDER_PAYMENT_STATES, ORDER_STATES, PAYMENT_METHOD_CODES } from "@/utils/constants";
import { ImageFilters } from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";
import { URL_CURRENCY_KEY, URL_DELIVERY_COUNTRY_KEY } from "@/utils/sessionStorageKeys";
import { isSessionValid } from "@/utils/token";
import { isNotNullNorUndefined, removeFieldsFromObject } from "@/utils/ts-utils";

import { AuthenticatedUser } from "./AuthenticatedUser";
import { AuthenticatedUserFromJWT } from "./AuthenticatedUserFromJWT";
import { authenticatedUserContext } from "./useAuthenticatedUserContext";

const ForgotPasswordDialog = dynamic(() => import("@/components/organisms/ForgotPasswordDialog"));
const ForgotPasswordValidationDialog = dynamic(
  () => import("@/components/organisms/ForgotPasswordValidationDialog"),
);
const LoginDialog = dynamic(() => import("@/components/organisms/LoginDialog"));
const SignupAfterResendMailValidationDialog = dynamic(
  () =>
    import(
      "@/components/organisms/SignupAfterResendMailValidationDialog/SignupAfterResendMailValidationDialog"
    ),
);
const SignupDialog = dynamic(() => import("@/components/organisms/SignupDialog"));
const SignupMailValidationDialog = dynamic(
  () => import("@/components/organisms/SignupMailValidationDialog"),
);
const SignupResendMailValidationDialog = dynamic(
  () =>
    import("@/components/organisms/SignupResendMailValidation/SignupResendMailValidationDialog"),
);

const ongoingBidsCountParams: GetCustomerAuctionItemsCustomerAuctionItemDTOCollectionParams = {
  filter: ["product_variant_x_small"],
  ongoing: true,
  itemsPerPage: 0, // itemsPerPage: 0 because we just want to know the total number of items
};

const AuthenticatedUserContextProviderAndLoginModal = ({ children }: PropsWithChildren) => {
  const { remove: removeUrlCurrencyKey } = useSessionStorageValue(URL_CURRENCY_KEY);
  const { remove: removeUrlDeliveryCountryKey } = useSessionStorageValue(URL_DELIVERY_COUNTRY_KEY);
  const { t, lang } = useTranslation("common");
  const { accessToken } = useAccessToken();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isSignupMailValidationModalOpen, setIsSignupMailValidationModalOpen] = useState(false);
  const [isResendMailValidationModalOpen, setIsResendMailValidationModalOpen] = useState(false);
  const [isEmailVerificationResentModalOpen, setIsEmailVerificationResentModalOpen] =
    useState(false);
  const [isPasswordForgotMailValidationModalOpen, setIsPasswordForgotMailValidationModalOpen] =
    useState(false);
  const queryClient = useQueryClient();

  const [emailToBeValidated, setEmailToBeValidated] = useState<string>();

  const [user, setUser] = useState<AuthenticatedUser | null | undefined>(null); // don't initialize state on first render to avoid hydration mismatch.
  const [cart, setCart] = useState<OrderJsonldShopCartRead>();
  const [numberOfNonPaidOrders, setNumberOfNonPaidOrders] = useState<number>(0);

  const {
    data: wishlist,
    isLoading: isWishlistLoading,
    isInitialLoading: isWishlistInitialLoading,
  } = useShopGetWishlistCustomerItem(user?.customerId ?? "", {
    query: { enabled: isNotNullNorUndefined(user) },
  });
  const wishlistBag = useMemo(
    () =>
      new Map<string, IndexedProductVariantDTOJsonldShopWishlistRead>(
        wishlist?.favoriteProducts.map(variant => [variant.code ?? "invalid-code", variant]),
      ),
    [wishlist],
  );

  const { data: auctionAlerts } = useGetAuctionAlertCollection(
    { filter: [ImageFilters.ALERT] },
    { query: { enabled: isNotNullNorUndefined(user) } },
  );
  const auctionAlertsBag = useMemo(
    () =>
      new Map<string, AuctionAlertJsonldShopAuctionAlertRead>(
        auctionAlerts?.["hydra:member"].map(alert => [
          alert.productVariantInAuctionCatalog?.productVariant?.code ?? "invalid-code",
          alert,
        ]),
      ),
    [auctionAlerts],
  );

  const { mutateAsync: getOrCreateCart, isLoading, isIdle } = useShopPostOrderCollection();
  const { data: nonPaidOrdersData } = useShopGetOrderCollection(
    {
      filter: [ImageFilters.CART],
      "shipments.method.code": ShippingMethodJsonldShopOrderReadCode["WORLD-SHIPPING-GROUPMENT"],
      "payments.method.code": PAYMENT_METHOD_CODES.PAY_LATER,
      paymentState: ORDER_PAYMENT_STATES.STATE_AWAITING_PAYMENT,
      state: ORDER_STATES.STATE_NEW,
      itemsPerPage: 0, // itemsPerPage: 0 because we just want to know the total number of items
    },
    { query: { enabled: isNotNullNorUndefined(user) } },
  );

  const { data: productVariantInOngoingBids } =
    useGetCustomerAuctionItemsCustomerAuctionItemDTOCollection(ongoingBidsCountParams, {
      query: { enabled: isNotNullNorUndefined(user) },
    });

  const numberOfOngoingBids = productVariantInOngoingBids?.["hydra:totalItems"];

  const setNumberOfOngoingBids = useCallback(
    (newNumber: number) => {
      queryClient.setQueryData(
        getGetCustomerAuctionItemsCustomerAuctionItemDTOCollectionQueryKey(ongoingBidsCountParams),
        { ...productVariantInOngoingBids, ["hydra:totalItems"]: newNumber },
      );
    },
    [productVariantInOngoingBids, queryClient],
  );

  const isFetchCartLoading = isLoading || isIdle;

  const authenticatedUserFromJWT = isSessionValid(accessToken)
    ? jwtDecode<AuthenticatedUserFromJWT>(accessToken)
    : undefined;

  const stringifiedUsefulFields =
    authenticatedUserFromJWT !== undefined
      ? JSON.stringify(removeFieldsFromObject(authenticatedUserFromJWT, ["exp", "iat"]))
      : undefined;

  const isFetching = useRef(false);

  const fetchCart = useCallback(async () => {
    try {
      if (isFetching.current) return;

      isFetching.current = true;

      const currentCart = await getOrCreateCart({
        data: {},
        params: { filter: [ImageFilters.CART] },
      });

      isFetching.current = false;

      setCart(currentCart);

      return currentCart;
    } catch (error) {
      isFetching.current = false;

      toast.error<string>(t("common.errorWhileRetrievingCart"));
    }
  }, [getOrCreateCart, t]);

  useEffect(() => {
    setNumberOfNonPaidOrders(nonPaidOrdersData?.["hydra:totalItems"] ?? 0);
  }, [nonPaidOrdersData]);

  useEffect(() => {
    const userObject = AuthenticatedUser.createFromJWTPayload(authenticatedUserFromJWT);
    setUser(userObject);

    if (userObject !== undefined) {
      if (document.hasFocus()) void fetchCart();
    } else {
      setCart(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedUsefulFields, lang]); // update cart only if useful user fields change or when language changes

  useEffect(() => {
    const onWindowFocus = () => {
      if (!cart && user) void fetchCart();
    };

    window.addEventListener("focus", onWindowFocus);

    return () => {
      window.removeEventListener("focus", onWindowFocus);
    };
  }, [cart, fetchCart, user]);

  useUpdateEffect(() => {
    if (typeof authenticatedUserFromJWT?.id === "number") {
      if (typeof authenticatedUserFromJWT.currencyCode === "string") {
        removeUrlCurrencyKey();
      }
      if (typeof authenticatedUserFromJWT.countryCode === "string") {
        removeUrlDeliveryCountryKey();
      }
    }
  }, [
    authenticatedUserFromJWT?.id,
    removeUrlCurrencyKey,
    authenticatedUserFromJWT?.currencyCode,
    authenticatedUserFromJWT?.countryCode,
    removeUrlDeliveryCountryKey,
  ]);

  return (
    <authenticatedUserContext.Provider
      value={{
        user,
        isLoginModalOpen,
        cart,
        setIsLoginModalOpen,
        setIsSignupModalOpen,
        setIsForgotPasswordModalOpen,
        setIsResendMailValidationModalOpen,
        setEmailToBeValidated,
        fetchCart,
        setCart,
        numberOfOngoingBids,
        setNumberOfOngoingBids,
        isFetchCartLoading,
        wishlist: wishlistBag,
        isWishlistLoading: isWishlistLoading || isWishlistInitialLoading,
        auctionAlerts: auctionAlertsBag,
        numberOfNonPaidOrders,
        setNumberOfNonPaidOrders,
      }}
    >
      <LoginDialog open={isLoginModalOpen} setOpen={setIsLoginModalOpen} />
      <ForgotPasswordDialog
        open={isForgotPasswordModalOpen}
        setOpen={setIsForgotPasswordModalOpen}
        setIsPasswordForgotMailValidationModalOpen={setIsPasswordForgotMailValidationModalOpen}
      />
      <SignupDialog
        open={isSignupModalOpen}
        setOpen={setIsSignupModalOpen}
        setIsSignupMailValidationModalOpen={setIsSignupMailValidationModalOpen}
      />
      <SignupMailValidationDialog
        open={isSignupMailValidationModalOpen}
        setOpen={setIsSignupMailValidationModalOpen}
      />
      <SignupResendMailValidationDialog
        open={isResendMailValidationModalOpen}
        setOpen={setIsResendMailValidationModalOpen}
        emailToBeValidated={emailToBeValidated ?? ""}
        setIsEmailSentModalOpen={setIsEmailVerificationResentModalOpen}
      />
      <SignupAfterResendMailValidationDialog
        open={isEmailVerificationResentModalOpen}
        setOpen={setIsEmailVerificationResentModalOpen}
      />
      <ForgotPasswordValidationDialog
        open={isPasswordForgotMailValidationModalOpen}
        setOpen={setIsPasswordForgotMailValidationModalOpen}
      />
      {children}
    </authenticatedUserContext.Provider>
  );
};

export default AuthenticatedUserContextProviderAndLoginModal;
