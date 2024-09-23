import { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useAccessToken } from "@/hooks/useAccessToken";
import { nextLangToSyliusLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { isAccessTokenValid } from "@/utils/token";

import { usePostCredentialsItem } from "../sylius-api-client/shop-user-token/shop-user-token";
import { useShopVerifyCustomerAccountVerifyCustomerAccountItem } from "../sylius-api-client/verify-customer-account/verify-customer-account";
import {
  axiosInstance,
  markAxiosAsInitialized,
  realApiBaseURL,
  refreshTokenAxiosInstance,
} from "./custom-client-instance";

let refreshTokenRequest: Promise<string> | null = null;

const LOGIN_URL = "/api/v2/shop/authentication-token";
const REFRESH_TOKEN_URL = "/api/v2/shop/refresh-token/refresh";
export const LOGOUT_URL = "/api/v2/shop/refresh-token/invalidate";
export const PRIVATE_PAGES_PREFIX = "/my_";

const urlMustNotUseAccessToken = (url?: string) => [undefined, LOGIN_URL].includes(url);

export const isPagePrivate = (url: string) => url.startsWith(PRIVATE_PAGES_PREFIX);

const useHandleUnauthorizedCall = () => {
  const { setIsLoginModalOpen } = useAuthenticatedUserContext();
  const { push, asPath } = useRouter();

  const handleUnauthorizedCall = useCallback(() => {
    if (isPagePrivate(asPath)) {
      void push(`/login?dest=${asPath}`);
    } else {
      setIsLoginModalOpen(true);
    }
  }, [setIsLoginModalOpen, push, asPath]);

  return { handleUnauthorizedCall };
};

export const useSendRefreshTokenRequest = () => {
  const { setAccessToken, removeAccessToken } = useAccessToken();
  const { handleUnauthorizedCall } = useHandleUnauthorizedCall();

  const sendRefreshTokenRequest = useCallback(() => {
    if (refreshTokenRequest === null) {
      refreshTokenRequest = refreshTokenAxiosInstance
        .get<{ token: string }>(REFRESH_TOKEN_URL, { withCredentials: true }) // withCredentials to allow cookies to be sent
        .then(({ data: { token } }) => {
          setAccessToken(token);
          refreshTokenRequest = null;

          return token;
        })
        .catch((error: AxiosError) => {
          removeAccessToken();
          refreshTokenRequest = null;

          if (error.response?.status === 401) handleUnauthorizedCall();

          throw error;
        });
    }

    return refreshTokenRequest;
  }, [setAccessToken, removeAccessToken, handleUnauthorizedCall]);

  return { sendRefreshTokenRequest };
};

export const usePostCredentials: typeof usePostCredentialsItem = options =>
  usePostCredentialsItem({
    ...options,
    request: { ...options?.request, baseURL: realApiBaseURL, withCredentials: true }, // withCredentials to allow cookies to be set
  });

export const useVerifyCustomerAccount: typeof useShopVerifyCustomerAccountVerifyCustomerAccountItem =
  options =>
    useShopVerifyCustomerAccountVerifyCustomerAccountItem({
      ...options,
      request: { ...options?.request, baseURL: realApiBaseURL, withCredentials: true }, // withCredentials to allow cookies to be set
    });

const useRegisterAxiosInterceptors = () => {
  const { accessToken } = useAccessToken();
  const { sendRefreshTokenRequest } = useSendRefreshTokenRequest();
  const { lang } = useTranslation();

  useEffect(() => {
    const requestInterceptorId = axiosInstance.interceptors.request.use(
      requestConfig => {
        requestConfig.headers["Accept-Language"] = nextLangToSyliusLocale(lang);

        if (urlMustNotUseAccessToken(requestConfig.url)) return requestConfig;

        if (isAccessTokenValid(accessToken)) {
          requestConfig.headers.Authorization = `Bearer ${accessToken}`;
        }

        return requestConfig;
      },
      error => Promise.reject(error),
    );

    const responseInterceptorId = axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        if (!isAxiosError(error) || urlMustNotUseAccessToken(error.config?.url)) {
          return Promise.reject(error);
        }

        if (
          error.config &&
          error.response &&
          [401, 404].includes(error.response.status) && // some endpoints return 404 when token is invalid
          !(error.config as { __isRetryRequest?: boolean }).__isRetryRequest
        ) {
          const refreshedAccessToken = await sendRefreshTokenRequest();

          error.config.headers.Authorization = `Bearer ${refreshedAccessToken}`;

          (error.config as { __isRetryRequest?: boolean }).__isRetryRequest = true;

          return axiosInstance(error.config);
        }

        return Promise.reject(error);
      },
    );

    markAxiosAsInitialized();

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptorId);
      axiosInstance.interceptors.response.eject(responseInterceptorId);
    };
  }, [accessToken, lang, sendRefreshTokenRequest]);
};

export const RegisterAxiosInterceptors = () => {
  useRegisterAxiosInterceptors();

  return null;
};
