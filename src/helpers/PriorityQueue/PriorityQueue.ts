/**
 * @name PriorityQueue
 * @description A binary min-heap: `pop()` always returns the item with the lowest priority number first.
 * @category data-structure
 * @tags data-structure, heap, priority-queue
 * @usage low
 *
 * @example
 * const pq = new PriorityQueue<string>();
 * pq.push("low", 5);
 * pq.push("high", 1);
 * pq.pop(); // "high"
 */
export class PriorityQueue<T> {
  #heap: Array<{ value: T; priority: number }> = [];

  get size(): number {
    return this.#heap.length;
  }

  get isEmpty(): boolean {
    return this.#heap.length === 0;
  }

  push(value: T, priority: number): void {
    this.#heap.push({ value, priority });

    let i = this.#heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.#heap[parent]!.priority <= this.#heap[i]!.priority) break;
      [this.#heap[parent], this.#heap[i]] = [this.#heap[i]!, this.#heap[parent]!];
      i = parent;
    }
  }

  pop(): T | undefined {
    if (!this.#heap.length) return undefined;

    const top = this.#heap[0]!;
    const last = this.#heap.pop()!;

    if (this.#heap.length) {
      this.#heap[0] = last;
      let i = 0;
      for (;;) {
        const left = i * 2 + 1;
        const right = i * 2 + 2;
        let smallest = i;
        if (left < this.#heap.length && this.#heap[left]!.priority < this.#heap[smallest]!.priority) {
          smallest = left;
        }
        if (right < this.#heap.length && this.#heap[right]!.priority < this.#heap[smallest]!.priority) {
          smallest = right;
        }
        if (smallest === i) break;
        [this.#heap[i], this.#heap[smallest]] = [this.#heap[smallest]!, this.#heap[i]!];
        i = smallest;
      }
    }

    return top.value;
  }

  peek(): T | undefined {
    return this.#heap[0]?.value;
  }
}
