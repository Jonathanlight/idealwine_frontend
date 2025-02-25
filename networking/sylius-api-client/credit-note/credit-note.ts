/**
 * Generated by orval v6.19.0 🍺
 * Do not edit manually.
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  CreditNoteJsonldShopCreditNotesRead,
  CreditNoteShopCreditNotesRead,
  GetCreditNoteCollection200,
  GetCreditNoteCollectionParams,
} from "../.ts.schemas";
import { customInstance } from "../../mutator/custom-client-instance";

// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir/49579497#49579497
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? A
  : B;

type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>;
}[keyof T];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;
type DistributeReadOnlyOverUnions<T> = T extends any ? NonReadonly<T> : never;

type Writable<T> = Pick<T, WritableKeys<T>>;
type NonReadonly<T> = [T] extends [UnionToIntersection<T>]
  ? {
      [P in keyof Writable<T>]: T[P] extends object ? NonReadonly<NonNullable<T[P]>> : T[P];
    }
  : DistributeReadOnlyOverUnions<T>;

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

/**
 * @summary Retrieves a CreditNote resource.
 */
export const getCreditNoteItem = (
  id: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<void>(
    { url: `/api/v2/credit-notes/${id}`, method: "get", signal },
    options,
  );
};

export const getGetCreditNoteItemQueryKey = (id: string) => {
  return [`/api/v2/credit-notes/${id}`] as const;
};

export const getGetCreditNoteItemQueryOptions = <
  TData = Awaited<ReturnType<typeof getCreditNoteItem>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCreditNoteItem>>, TError, TData>;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetCreditNoteItemQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCreditNoteItem>>> = ({ signal }) =>
    getCreditNoteItem(id, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getCreditNoteItem>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetCreditNoteItemQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCreditNoteItem>>
>;
export type GetCreditNoteItemQueryError = unknown;

/**
 * @summary Retrieves a CreditNote resource.
 */
export const useGetCreditNoteItem = <
  TData = Awaited<ReturnType<typeof getCreditNoteItem>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCreditNoteItem>>, TError, TData>;
    request?: SecondParameter<typeof customInstance>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetCreditNoteItemQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Retrieves the collection of CreditNote resources.
 */
export const getCreditNoteCollection = (
  params?: GetCreditNoteCollectionParams,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<GetCreditNoteCollection200>(
    { url: `/api/v2/shop/credit-notes`, method: "get", params, signal },
    options,
  );
};

export const getGetCreditNoteCollectionQueryKey = (params?: GetCreditNoteCollectionParams) => {
  return [`/api/v2/shop/credit-notes`, ...(params ? [params] : [])] as const;
};

export const getGetCreditNoteCollectionQueryOptions = <
  TData = Awaited<ReturnType<typeof getCreditNoteCollection>>,
  TError = unknown,
>(
  params?: GetCreditNoteCollectionParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCreditNoteCollection>>, TError, TData>;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetCreditNoteCollectionQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getCreditNoteCollection>>> = ({
    signal,
  }) => getCreditNoteCollection(params, requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getCreditNoteCollection>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetCreditNoteCollectionQueryResult = NonNullable<
  Awaited<ReturnType<typeof getCreditNoteCollection>>
>;
export type GetCreditNoteCollectionQueryError = unknown;

/**
 * @summary Retrieves the collection of CreditNote resources.
 */
export const useGetCreditNoteCollection = <
  TData = Awaited<ReturnType<typeof getCreditNoteCollection>>,
  TError = unknown,
>(
  params?: GetCreditNoteCollectionParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCreditNoteCollection>>, TError, TData>;
    request?: SecondParameter<typeof customInstance>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetCreditNoteCollectionQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Updates the CreditNote resource.
 */
export const patchCreditNoteItem = (
  id: string,
  creditNoteShopCreditNotesRead: NonReadonly<CreditNoteShopCreditNotesRead>,
  options?: SecondParameter<typeof customInstance>,
) => {
  return customInstance<CreditNoteJsonldShopCreditNotesRead>(
    {
      url: `/api/v2/shop/credit-notes/${id}/enable`,
      method: "patch",
      headers: { "Content-Type": "application/merge-patch+json" },
      data: creditNoteShopCreditNotesRead,
    },
    options,
  );
};

export const getPatchCreditNoteItemMutationOptions = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchCreditNoteItem>>,
    TError,
    { id: string; data: NonReadonly<CreditNoteShopCreditNotesRead> },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchCreditNoteItem>>,
  TError,
  { id: string; data: NonReadonly<CreditNoteShopCreditNotesRead> },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchCreditNoteItem>>,
    { id: string; data: NonReadonly<CreditNoteShopCreditNotesRead> }
  > = props => {
    const { id, data } = props ?? {};

    return patchCreditNoteItem(id, data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchCreditNoteItemMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchCreditNoteItem>>
>;
export type PatchCreditNoteItemMutationBody = NonReadonly<CreditNoteShopCreditNotesRead>;
export type PatchCreditNoteItemMutationError = void;

/**
 * @summary Updates the CreditNote resource.
 */
export const usePatchCreditNoteItem = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchCreditNoteItem>>,
    TError,
    { id: string; data: NonReadonly<CreditNoteShopCreditNotesRead> },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const mutationOptions = getPatchCreditNoteItemMutationOptions(options);

  return useMutation(mutationOptions);
};
