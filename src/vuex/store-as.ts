import {Subscriber, RawGetter} from './interface'
import {WatchHandler, WatchOption} from '../watch'
import {Opt} from './opt'

export interface ActionStore<S, G, M, A> {
  readonly dispatch: A
  readonly commit: M
  readonly getters: G
  readonly state: S
}

export class Store<S, G, M, A> implements ActionStore<S, G, M, A> {
  readonly dispatch: A
  readonly commit: M
  readonly getters: G
  readonly state: S

  constructor() {}
  subscribe(fn: Subscriber<S>): () => void {
    return function() {
    }
  }
  watch<R>(getter: RawGetter<S, R>, cb: WatchHandler<never, R>, options: WatchOption<never, R>): () => void {
    return function() {
    }
  }
  replaceState(state: S): void {
  }
  hotUpdate(newOptions: Opt<S, G, M, A>): void {
  }
}

