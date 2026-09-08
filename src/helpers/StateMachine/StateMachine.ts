/**
 * @name StateMachine
 * @description A minimal finite state machine: define allowed transitions per state, then `send()` events and read `.state`.
 * @category pattern
 * @tags pattern, state, fsm
 * @usage medium
 *
 * @example
 * const light = new StateMachine("red", { red: { go: "green" }, green: { stop: "red" } });
 * light.send("go");
 * light.state; // "green"
 */
export class StateMachine<S extends string, E extends string> {
  #state: S;
  #transitions: Record<S, Partial<Record<E, S>>>;

  constructor(initial: S, transitions: Record<S, Partial<Record<E, S>>>) {
    this.#state = initial;
    this.#transitions = transitions;
  }

  get state(): S {
    return this.#state;
  }

  can(event: E): boolean {
    return this.#transitions[this.#state]?.[event] !== undefined;
  }

  send(event: E): boolean {
    const next = this.#transitions[this.#state]?.[event];
    if (next === undefined) return false;
    this.#state = next;
    return true;
  }
}
