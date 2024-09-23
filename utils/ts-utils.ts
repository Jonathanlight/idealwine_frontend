export const isKeyInObject = <T extends Record<string | number | symbol, unknown>>(
  key: string | number | symbol,
  object: T,
): key is keyof T => key in object;

export const isValueInArray = <T>(value: unknown, array: Readonly<T[]> | T[]): value is T =>
  // @ts-expect-error value is unknown
  array.includes(value);

export const ObjectKeys = <T extends Record<string, unknown>>(obj: T): (keyof T)[] =>
  Object.keys(obj) as (keyof T)[];

export const isNullOrUndefined = <T>(value: T | undefined | null): value is null | undefined =>
  value === undefined || value === null;

export const isNotNullNorUndefined = <T>(value: T | undefined | null): value is T =>
  !isNullOrUndefined(value);

export const isNotBlank = (value: string | undefined | null): value is string =>
  isNotNullNorUndefined(value) && value !== "";

export const isBlank = (value: string | undefined | null): value is null | undefined | "" =>
  !isNotBlank(value);

export const removeFieldsFromObject = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  fields: K[],
): Omit<T, K> => {
  const newObj = { ...obj };
  for (const field of fields) {
    delete newObj[field];
  }

  return newObj;
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export const isNonNullObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object";

export const isNonEmptyArray = (value: unknown): value is [unknown, ...unknown[]] =>
  Array.isArray(value) && value.length > 0;

export const isNumber = (value: unknown): value is number => typeof value === "number";

export const isPositiveNumber = (value: unknown): value is number => isNumber(value) && value > 0;

export type DeepPartial<T> = unknown extends T
  ? T
  : T extends object
  ? {
      [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>;
    }
  : T;

export type RequiredNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};
