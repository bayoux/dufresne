/**
 * @name LRUCache
 * @description A fixed-capacity cache that evicts the least-recently-used entry once full — O(1) `get`/`set`.
 * @category data-structure
 * @tags data-structure, cache, lru
 * @usage high
 *
 * @example
 * const cache = new LRUCache<string, number>(2);
 * cache.set("a", 1);
 * cache.set("b", 2);
 * cache.set("c", 3); // evicts "a", the least recently used
 * cache.has("a"); // false
 */
export class LRUCache<K, V> {
  #capacity: number;
  #map = new Map<K, V>();

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("LRUCache: capacity must be > 0");
    this.#capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.#map.has(key)) return undefined;

    const value = this.#map.get(key) as V;
    this.#map.delete(key);
    this.#map.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.#map.has(key)) {
      this.#map.delete(key);
    } else if (this.#map.size >= this.#capacity) {
      const oldest = this.#map.keys().next().value;
      if (oldest !== undefined) this.#map.delete(oldest);
    }
    this.#map.set(key, value);
  }

  has(key: K): boolean {
    return this.#map.has(key);
  }

  get size(): number {
    return this.#map.size;
  }
}
