/**
 * @name PartialRecord
 * @description A `Record` where every value is optional — shorthand for `Partial<Record<K, V>>`.
 * @category types
 * @tags types, object, record
 * @usage medium
 *
 * @example
 * type Flags = PartialRecord<"dev" | "prod", boolean>;
 * // { dev?: boolean; prod?: boolean }
 */
export type PartialRecord<K extends PropertyKey, V> = Partial<Record<K, V>>;
