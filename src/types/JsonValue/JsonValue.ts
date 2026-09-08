export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

/**
 * @name JsonValue
 * @description Any value that survives a `JSON.stringify`/`JSON.parse` round-trip: a primitive, or nested arrays/objects of those.
 * @category types
 * @tags types, json, serialize
 * @usage medium
 *
 * @example
 * const config: JsonValue = { a: 1, b: [true, null, "x"] };
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
