/**
 * @name Queue
 * @description A FIFO queue — enqueue/dequeue/peek.
 * @category data-structure
 * @tags data-structure, queue, fifo
 * @usage medium
 *
 * @example
 * const q = new Queue<number>();
 * q.enqueue(1);
 * q.enqueue(2);
 * q.dequeue(); // 1
 */
export class Queue<T> {
  #items: T[] = [];

  enqueue(item: T): void {
    this.#items.push(item);
  }

  dequeue(): T | undefined {
    return this.#items.shift();
  }

  peek(): T | undefined {
    return this.#items[0];
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
