/**
 * Generated by orval v6.19.0 🍺
 * Do not edit manually.
 */
import { useMutation } from "@tanstack/react-query";
import type { MutationFunction, UseMutationOptions } from "@tanstack/react-query";
import type {
  AdminResetPasswordRequestAdminResetPasswordUpdate,
  AdminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate,
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
 * @summary Requests administrator's password reset
 */
export const adminCreateResetPasswordRequestAdminResetPasswordRequestCollection = (
  adminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate: NonReadonly<AdminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate>,
  options?: SecondParameter<typeof customInstance>,
) => {
  return customInstance<void>(
    {
      url: `/api/v2/admin/reset-password-requests`,
      method: "post",
      headers: { "Content-Type": "application/ld+json" },
      data: adminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate,
    },
    options,
  );
};

export const getAdminCreateResetPasswordRequestAdminResetPasswordRequestCollectionMutationOptions =
  <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<
      Awaited<
        ReturnType<typeof adminCreateResetPasswordRequestAdminResetPasswordRequestCollection>
      >,
      TError,
      {
        data: NonReadonly<AdminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate>;
      },
      TContext
    >;
    request?: SecondParameter<typeof customInstance>;
  }): UseMutationOptions<
    Awaited<ReturnType<typeof adminCreateResetPasswordRequestAdminResetPasswordRequestCollection>>,
    TError,
    {
      data: NonReadonly<AdminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate>;
    },
    TContext
  > => {
    const { mutation: mutationOptions, request: requestOptions } = options ?? {};

    const mutationFn: MutationFunction<
      Awaited<
        ReturnType<typeof adminCreateResetPasswordRequestAdminResetPasswordRequestCollection>
      >,
      {
        data: NonReadonly<AdminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate>;
      }
    > = props => {
      const { data } = props ?? {};

      return adminCreateResetPasswordRequestAdminResetPasswordRequestCollection(
        data,
        requestOptions,
      );
    };

    return { mutationFn, ...mutationOptions };
  };

export type AdminCreateResetPasswordRequestAdminResetPasswordRequestCollectionMutationResult =
  NonNullable<
    Awaited<ReturnType<typeof adminCreateResetPasswordRequestAdminResetPasswordRequestCollection>>
  >;
export type AdminCreateResetPasswordRequestAdminResetPasswordRequestCollectionMutationBody =
  NonReadonly<AdminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate>;
export type AdminCreateResetPasswordRequestAdminResetPasswordRequestCollectionMutationError =
  unknown;

/**
 * @summary Requests administrator's password reset
 */
export const useAdminCreateResetPasswordRequestAdminResetPasswordRequestCollection = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof adminCreateResetPasswordRequestAdminResetPasswordRequestCollection>>,
    TError,
    {
      data: NonReadonly<AdminResetPasswordRequestRequestResetPasswordEmailJsonldAdminResetPasswordCreate>;
    },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const mutationOptions =
    getAdminCreateResetPasswordRequestAdminResetPasswordRequestCollectionMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Resets administrator's password
 */
export const adminUpdateResetPasswordRequestAdminResetPasswordRequestItem = (
  resetPasswordToken: string,
  adminResetPasswordRequestAdminResetPasswordUpdate: AdminResetPasswordRequestAdminResetPasswordUpdate,
  options?: SecondParameter<typeof customInstance>,
) => {
  return customInstance<void>(
    {
      url: `/api/v2/admin/reset-password-requests/${resetPasswordToken}`,
      method: "patch",
      headers: { "Content-Type": "application/merge-patch+json" },
      data: adminResetPasswordRequestAdminResetPasswordUpdate,
    },
    options,
  );
};

export const getAdminUpdateResetPasswordRequestAdminResetPasswordRequestItemMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof adminUpdateResetPasswordRequestAdminResetPasswordRequestItem>>,
    TError,
    { resetPasswordToken: string; data: AdminResetPasswordRequestAdminResetPasswordUpdate },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof adminUpdateResetPasswordRequestAdminResetPasswordRequestItem>>,
  TError,
  { resetPasswordToken: string; data: AdminResetPasswordRequestAdminResetPasswordUpdate },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof adminUpdateResetPasswordRequestAdminResetPasswordRequestItem>>,
    { resetPasswordToken: string; data: AdminResetPasswordRequestAdminResetPasswordUpdate }
  > = props => {
    const { resetPasswordToken, data } = props ?? {};

    return adminUpdateResetPasswordRequestAdminResetPasswordRequestItem(
      resetPasswordToken,
      data,
      requestOptions,
    );
  };

  return { mutationFn, ...mutationOptions };
};

export type AdminUpdateResetPasswordRequestAdminResetPasswordRequestItemMutationResult =
  NonNullable<
    Awaited<ReturnType<typeof adminUpdateResetPasswordRequestAdminResetPasswordRequestItem>>
  >;
export type AdminUpdateResetPasswordRequestAdminResetPasswordRequestItemMutationBody =
  AdminResetPasswordRequestAdminResetPasswordUpdate;
export type AdminUpdateResetPasswordRequestAdminResetPasswordRequestItemMutationError = unknown;

/**
 * @summary Resets administrator's password
 */
export const useAdminUpdateResetPasswordRequestAdminResetPasswordRequestItem = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof adminUpdateResetPasswordRequestAdminResetPasswordRequestItem>>,
    TError,
    { resetPasswordToken: string; data: AdminResetPasswordRequestAdminResetPasswordUpdate },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const mutationOptions =
    getAdminUpdateResetPasswordRequestAdminResetPasswordRequestItemMutationOptions(options);

  return useMutation(mutationOptions);
};
