/**
 * Generated by orval v6.19.0 🍺
 * Do not edit manually.
 */
import { useQuery } from "@tanstack/react-query";
import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  ApiProductOptionsValuesGetSubresource200,
  ApiProductOptionsValuesGetSubresourceParams,
  ProductOptionValueJsonldAdminProductOptionValueRead,
  ProductOptionValueJsonldShopProductOptionValueRead,
} from "../.ts.schemas";
import { customInstance } from "../../mutator/custom-client-instance";

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

/**
 * @summary Retrieves a ProductOptionValue resource.
 */
export const adminGetProductOptionValueItem = (
  code: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<ProductOptionValueJsonldAdminProductOptionValueRead>(
    { url: `/api/v2/admin/product-option-values/${code}`, method: "get", signal },
    options,
  );
};

export const getAdminGetProductOptionValueItemQueryKey = (code: string) => {
  return [`/api/v2/admin/product-option-values/${code}`] as const;
};

export const getAdminGetProductOptionValueItemQueryOptions = <
  TData = Awaited<ReturnType<typeof adminGetProductOptionValueItem>>,
  TError = void,
>(
  code: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof adminGetProductOptionValueItem>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getAdminGetProductOptionValueItemQueryKey(code);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof adminGetProductOptionValueItem>>> = ({
    signal,
  }) => adminGetProductOptionValueItem(code, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!code, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof adminGetProductOptionValueItem>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type AdminGetProductOptionValueItemQueryResult = NonNullable<
  Awaited<ReturnType<typeof adminGetProductOptionValueItem>>
>;
export type AdminGetProductOptionValueItemQueryError = void;

/**
 * @summary Retrieves a ProductOptionValue resource.
 */
export const useAdminGetProductOptionValueItem = <
  TData = Awaited<ReturnType<typeof adminGetProductOptionValueItem>>,
  TError = void,
>(
  code: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof adminGetProductOptionValueItem>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getAdminGetProductOptionValueItemQueryOptions(code, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Retrieves the collection of ProductOptionValue resources.
 */
export const apiProductOptionsValuesGetSubresource = (
  code: string,
  params?: ApiProductOptionsValuesGetSubresourceParams,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<ApiProductOptionsValuesGetSubresource200>(
    { url: `/api/v2/admin/product-options/${code}/values`, method: "get", params, signal },
    options,
  );
};

export const getApiProductOptionsValuesGetSubresourceQueryKey = (
  code: string,
  params?: ApiProductOptionsValuesGetSubresourceParams,
) => {
  return [`/api/v2/admin/product-options/${code}/values`, ...(params ? [params] : [])] as const;
};

export const getApiProductOptionsValuesGetSubresourceQueryOptions = <
  TData = Awaited<ReturnType<typeof apiProductOptionsValuesGetSubresource>>,
  TError = void,
>(
  code: string,
  params?: ApiProductOptionsValuesGetSubresourceParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof apiProductOptionsValuesGetSubresource>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getApiProductOptionsValuesGetSubresourceQueryKey(code, params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof apiProductOptionsValuesGetSubresource>>
  > = ({ signal }) => apiProductOptionsValuesGetSubresource(code, params, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!code, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof apiProductOptionsValuesGetSubresource>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ApiProductOptionsValuesGetSubresourceQueryResult = NonNullable<
  Awaited<ReturnType<typeof apiProductOptionsValuesGetSubresource>>
>;
export type ApiProductOptionsValuesGetSubresourceQueryError = void;

/**
 * @summary Retrieves the collection of ProductOptionValue resources.
 */
export const useApiProductOptionsValuesGetSubresource = <
  TData = Awaited<ReturnType<typeof apiProductOptionsValuesGetSubresource>>,
  TError = void,
>(
  code: string,
  params?: ApiProductOptionsValuesGetSubresourceParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof apiProductOptionsValuesGetSubresource>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getApiProductOptionsValuesGetSubresourceQueryOptions(code, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Retrieves a ProductOptionValue resource.
 */
export const shopGetProductOptionValueItem = (
  code: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<ProductOptionValueJsonldShopProductOptionValueRead>(
    { url: `/api/v2/shop/product-option-values/${code}`, method: "get", signal },
    options,
  );
};

export const getShopGetProductOptionValueItemQueryKey = (code: string) => {
  return [`/api/v2/shop/product-option-values/${code}`] as const;
};

export const getShopGetProductOptionValueItemQueryOptions = <
  TData = Awaited<ReturnType<typeof shopGetProductOptionValueItem>>,
  TError = void,
>(
  code: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof shopGetProductOptionValueItem>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getShopGetProductOptionValueItemQueryKey(code);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof shopGetProductOptionValueItem>>> = ({
    signal,
  }) => shopGetProductOptionValueItem(code, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!code, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof shopGetProductOptionValueItem>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type ShopGetProductOptionValueItemQueryResult = NonNullable<
  Awaited<ReturnType<typeof shopGetProductOptionValueItem>>
>;
export type ShopGetProductOptionValueItemQueryError = void;

/**
 * @summary Retrieves a ProductOptionValue resource.
 */
export const useShopGetProductOptionValueItem = <
  TData = Awaited<ReturnType<typeof shopGetProductOptionValueItem>>,
  TError = void,
>(
  code: string,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<typeof shopGetProductOptionValueItem>>,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getShopGetProductOptionValueItemQueryOptions(code, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};
