/**
 * @name Stack
 * @description A LIFO stack — push/pop/peek in O(1).
 * @category data-structure
 * @tags data-structure, stack, lifo
 * @usage medium
 *
 * @example
 * const s = new Stack<number>();
 * s.push(1);
 * s.push(2);
 * s.pop(); // 2
 */
export class Stack<T> {
  #items: T[] = [];

  push(item: T): void {
    this.#items.push(item);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  peek(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  get size(): number {
    return this.#items.length;
  }

  get isEmpty(): boolean {
    return this.#items.length === 0;
  }

  toArray(): T[] {
    return [...this.#items];
  }
}
