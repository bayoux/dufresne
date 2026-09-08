/**
 * @name defaults
 * @description Fills in `undefined` properties of an object from one or more source objects, without mutating any of them.
 * @category object
 * @tags object, merge
 * @usage medium
 *
 * @param {T} obj The base object
 * @param {...Partial<T>} sources Fallback values, earlier sources win
 * @returns {T} A new object with every gap filled in
 *
 * @example
 * defaults({ a: 1 }, { a: 2, b: 2 }, { b: 3, c: 3 }); // { a: 1, b: 2, c: 3 }
 */
export function defaults<T extends object>(obj: T, ...sources: Array<Partial<T>>): T {
  const result = { ...obj };

  for (const source of sources) {
    for (const key of Object.keys(source) as Array<keyof T>) {
      if (result[key] === undefined) result[key] = source[key] as T[keyof T];
    }
  }

  return result;
}
