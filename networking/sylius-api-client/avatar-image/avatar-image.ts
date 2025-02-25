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
  AdminPostAvatarImageCollectionBody,
  AvatarImageJsonldAdminAvatarImageRead,
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
 * @summary Creates a AvatarImage resource.
 */
export const adminPostAvatarImageCollection = (
  adminPostAvatarImageCollectionBody: AdminPostAvatarImageCollectionBody,
  options?: SecondParameter<typeof customInstance>,
) => {
  const formData = new FormData();
  if (adminPostAvatarImageCollectionBody.file !== undefined) {
    formData.append("file", adminPostAvatarImageCollectionBody.file);
  }
  if (adminPostAvatarImageCollectionBody.owner !== undefined) {
    formData.append("owner", adminPostAvatarImageCollectionBody.owner);
  }

  return customInstance<AvatarImageJsonldAdminAvatarImageRead>(
    {
      url: `/api/v2/admin/avatar-images`,
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
    },
    options,
  );
};

export const getAdminPostAvatarImageCollectionMutationOptions = <
  TError = void,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof adminPostAvatarImageCollection>>,
    TError,
    { data: AdminPostAvatarImageCollectionBody },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof adminPostAvatarImageCollection>>,
  TError,
  { data: AdminPostAvatarImageCollectionBody },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof adminPostAvatarImageCollection>>,
    { data: AdminPostAvatarImageCollectionBody }
  > = props => {
    const { data } = props ?? {};

    return adminPostAvatarImageCollection(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AdminPostAvatarImageCollectionMutationResult = NonNullable<
  Awaited<ReturnType<typeof adminPostAvatarImageCollection>>
>;
export type AdminPostAvatarImageCollectionMutationBody = AdminPostAvatarImageCollectionBody;
export type AdminPostAvatarImageCollectionMutationError = void;

/**
 * @summary Creates a AvatarImage resource.
 */
export const useAdminPostAvatarImageCollection = <TError = void, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof adminPostAvatarImageCollection>>,
    TError,
    { data: AdminPostAvatarImageCollectionBody },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const mutationOptions = getAdminPostAvatarImageCollectionMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Retrieves a AvatarImage resource.
 */
export const adminGetAvatarImageItem = (
  id: string,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal,
) => {
  return customInstance<AvatarImageJsonldAdminAvatarImageRead>(
    { url: `/api/v2/admin/avatar-images/${id}`, method: "get", signal },
    options,
  );
};

export const getAdminGetAvatarImageItemQueryKey = (id: string) => {
  return [`/api/v2/admin/avatar-images/${id}`] as const;
};

export const getAdminGetAvatarImageItemQueryOptions = <
  TData = Awaited<ReturnType<typeof adminGetAvatarImageItem>>,
  TError = void,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminGetAvatarImageItem>>, TError, TData>;
    request?: SecondParameter<typeof customInstance>;
  },
) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getAdminGetAvatarImageItemQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof adminGetAvatarImageItem>>> = ({
    signal,
  }) => adminGetAvatarImageItem(id, requestOptions, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof adminGetAvatarImageItem>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type AdminGetAvatarImageItemQueryResult = NonNullable<
  Awaited<ReturnType<typeof adminGetAvatarImageItem>>
>;
export type AdminGetAvatarImageItemQueryError = void;

/**
 * @summary Retrieves a AvatarImage resource.
 */
export const useAdminGetAvatarImageItem = <
  TData = Awaited<ReturnType<typeof adminGetAvatarImageItem>>,
  TError = void,
>(
  id: string,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminGetAvatarImageItem>>, TError, TData>;
    request?: SecondParameter<typeof customInstance>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getAdminGetAvatarImageItemQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary Removes the AvatarImage resource.
 */
export const adminDeleteAvatarImageItem = (
  id: string,
  options?: SecondParameter<typeof customInstance>,
) => {
  return customInstance<void>(
    { url: `/api/v2/admin/avatar-images/${id}`, method: "delete" },
    options,
  );
};

export const getAdminDeleteAvatarImageItemMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof adminDeleteAvatarImageItem>>,
    TError,
    { id: string },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof adminDeleteAvatarImageItem>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof adminDeleteAvatarImageItem>>,
    { id: string }
  > = props => {
    const { id } = props ?? {};

    return adminDeleteAvatarImageItem(id, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AdminDeleteAvatarImageItemMutationResult = NonNullable<
  Awaited<ReturnType<typeof adminDeleteAvatarImageItem>>
>;

export type AdminDeleteAvatarImageItemMutationError = unknown;

/**
 * @summary Removes the AvatarImage resource.
 */
export const useAdminDeleteAvatarImageItem = <TError = unknown, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof adminDeleteAvatarImageItem>>,
    TError,
    { id: string },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const mutationOptions = getAdminDeleteAvatarImageItemMutationOptions(options);

  return useMutation(mutationOptions);
};
