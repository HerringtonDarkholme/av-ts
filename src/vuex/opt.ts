import {ActionStore, Store} from './store-as'
import {CommitOption} from './interface'

export type F1<A, R> = (a: A) => R

export class Opt<S, G, M, A, P> {

  constructor(s: S) {}

  getter<K extends string, T>(key: K, f: (s: S) => T): Opt<S, ((k: K) => T) & G, M, A, P> {
    return this as any
  }

  mutation<K extends string, T, F extends (t: T) => void>(key: K, f: (s: S) => F & F1<T, void>): Opt<S, G, ((k: K, opt?: CommitOption) => F) & M, A, {type: K, payload: T} | P>
  {
    return this as any
  }

  action<K extends string, T, F extends (t: T) => {}>(key: K, f: (s: ActionStore<S, G, M, A>) => F & F1<T, {}>): Opt<S, G, M, ((k: K) => F) & A,  P>
  {
    return this as any
  }

  module<K extends string, S1, G1, M1, A1, P1>(k: K, s: Opt<S1, G1, M1, A1, P1>): Opt<S & {readonly $: (k: K) => S1}, G1 & G, M1 & M, A1 & A, P1 | P> {
    return this as any
  }

  plugin(p: (s: Store<S, G, M, A, P>) => void): this {
    return this
  }

  strict(): this {
    return this
  }

  done(): Store<S, G, M, A, P> {
    return null as any
  }
}

export function create(): Opt<never, never, never, never, never>
export function create<S>(s: S): Opt<S, never, never, never, never>
export function create<S>(s?: S): Opt<S, never, never, never, never> {
  if (!s) s = {} as any
  return new Opt(s) as any
}
