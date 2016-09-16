import {ActionStore, Store} from './store-as'

export type Never = (n: never) => never
export type F0<R> = () => R
export type F1<A, R> = (a: A) => R

export class Opt<S, G, M, A> {
  getter<K extends string, T>(key: K, f: (s: S) => T): Opt<S, ((k: K) => T) & G, M, A> {
    return this as any
  }
  mutation<K extends string, T>(key: K, f: (s: S) => F1<T, void>): Opt<S, G, ((k: K, opt?: {}) => F1<T, void>) & M, A>
  mutation<K extends string>(key: K, f: (s: S) => F0<void>): Opt<S, G, ((k: K, opt?: {}) => F0<void>) & M, A> {
    return this as any
  }

  action<K extends string, T, R>(k: K, f: (s: ActionStore<S, G, M, A>) => F1<T, R|Promise<R>>): Opt<S, G, M, ((k: K) => F1<T, Promise<R>>) & A>
  action<K extends string, R>(k: K, f: (s: ActionStore<S, G, M, A>) => F0<R|Promise<R>>): Opt<S, G, M, ((k: K) => F0<Promise<R>>) & A>
  {
    return this as any
  }

  module<K extends string, S1, G1, M1, A1>(k: K, s: Opt<S1, G1, M1, A1>): Opt<S & {readonly $: (k: K) => S1}, G1 & G, M1 & M, A1 & A> {
    return this as any
  }

  strict(): this {
    return this
  }

  done(): Store<S, G, M, A> {
    return null as any
  }
  static create<S>(s: S): Opt<S, Never, Never, Never> {
    return new Opt() as any
  }
}
