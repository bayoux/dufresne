// A listener can take any argument shape depending on the event, so this
// intentionally opts out of parameter checking the way DOM/Node event
// emitters do.
type Listener = (...args: any[]) => void;

/**
 * @name EventEmitter
 * @description A minimal publish/subscribe emitter — `on`/`off`/`once`/`emit`.
 * @category pattern
 * @tags pattern, events, pubsub
 * @usage high
 *
 * @example
 * const emitter = new EventEmitter();
 * emitter.on("greet", (name: string) => console.log(`Hello, ${name}!`));
 * emitter.emit("greet", "world");
 */
export class EventEmitter {
  #listeners = new Map<string, Set<Listener>>();

  on(event: string, listener: Listener): void {
    let set = this.#listeners.get(event);
    if (!set) {
      set = new Set();
      this.#listeners.set(event, set);
    }
    set.add(listener);
  }

  off(event: string, listener: Listener): void {
    this.#listeners.get(event)?.delete(listener);
  }

  once(event: string, listener: Listener): void {
    const wrapper: Listener = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
  }

  emit(event: string, ...args: unknown[]): void {
    for (const listener of this.#listeners.get(event) ?? []) listener(...args);
  }

  listenerCount(event: string): number {
    return this.#listeners.get(event)?.size ?? 0;
  }
}
