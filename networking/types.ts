/**
 * propertyPath can be empty string if the violation is not related to a specific property (class level validation)
 */
export type ConstraintViolationList<T extends string = string> = {
  violations: { propertyPath: T | ""; message: string; code: string | null }[];
};
