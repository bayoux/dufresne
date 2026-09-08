class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * @name LinkedList
 * @description A singly linked list — O(1) push/shift, O(n) random access.
 * @category data-structure
 * @tags data-structure, linked-list
 * @usage low
 *
 * @example
 * const list = new LinkedList<number>();
 * list.push(1);
 * list.push(2);
 * list.toArray(); // [1, 2]
 */
export class LinkedList<T> {
  #head: ListNode<T> | null = null;
  #tail: ListNode<T> | null = null;
  #size = 0;

  push(value: T): void {
    const node = new ListNode(value);
    if (this.#tail) this.#tail.next = node;
    else this.#head = node;
    this.#tail = node;
    this.#size++;
  }

  shift(): T | undefined {
    if (!this.#head) return undefined;
    const value = this.#head.value;
    this.#head = this.#head.next;
    if (!this.#head) this.#tail = null;
    this.#size--;
    return value;
  }

  get size(): number {
    return this.#size;
  }

  get isEmpty(): boolean {
    return this.#size === 0;
  }

  toArray(): T[] {
    const result: T[] = [];
    let node = this.#head;
    while (node) {
      result.push(node.value);
      node = node.next;
    }
    return result;
  }
}
