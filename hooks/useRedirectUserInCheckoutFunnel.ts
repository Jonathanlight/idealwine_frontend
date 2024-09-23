import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useFullPageLoaderContext } from "@/context/FullPageLoaderContext/useFullPageLoaderContext";
import { translatedLinks } from "@/urls/linksTranslation";
import { ORDER_CHECKOUT_STATES } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

const CHECKOUT_SECURITY_LEVELS = {
  CART_HAS_BEEN_ADRESSED: 1,
  CART_SHIPPING_HAS_BEEN_SELECTED: 2,
};

type securityLevel = keyof typeof CHECKOUT_SECURITY_LEVELS;

export const useRedirectInCheckoutFunnel = (securityLevel: securityLevel): void => {
  const { lang } = useTranslation();
  const { user, cart } = useAuthenticatedUserContext();
  const { replace } = useRouter();
  const { setIsFullPageLoaderOpen } = useFullPageLoaderContext();
  const cartHasBeenAddressed = cart?.checkoutState !== ORDER_CHECKOUT_STATES.STATE_CART;
  const shippingHasBeenSelected =
    cart?.checkoutState !== ORDER_CHECKOUT_STATES.STATE_CART &&
    cart?.checkoutState !== ORDER_CHECKOUT_STATES.STATE_ADDRESSED;
  const requiredSecurityLevel = CHECKOUT_SECURITY_LEVELS[securityLevel];

  const findRedirectionAddress = () => {
    if (requiredSecurityLevel >= 1 && cart && !cartHasBeenAddressed) {
      return translatedLinks.BASKET_URL[lang];
    }

    if (requiredSecurityLevel >= 2 && cart && !shippingHasBeenSelected) {
      return translatedLinks.SHIPPING_URL[lang];
    }

    return null;
  };

  useEffect(() => {
    const redirectionAddress = findRedirectionAddress();
    if (isNotNullNorUndefined(redirectionAddress)) {
      void replace(redirectionAddress).then(() => setIsFullPageLoaderOpen(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cart]);
};
