/**
 * @name Brand
 * @description Tags a primitive type so structurally-identical values from different domains can't be mixed up (nominal typing).
 * @category types
 * @tags types, nominal, opaque
 * @usage medium
 *
 * @example
 * type UserId = Brand<string, "UserId">;
 * type OrderId = Brand<string, "OrderId">;
 * // a UserId and an OrderId are no longer interchangeable, even though both are strings
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };
