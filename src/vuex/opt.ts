import {ActionStore, Store} from './store-as'
import {CommitOption} from './interface'

export type F0<R> = () => R
export type F01<T, R> = (t?: T) => R
export type F1<A, R> = (a: A) => R

export class Opt<S, G, M, A, P> {

  constructor(s: S) {}

  getter<K extends string, T>(key: K, f: (s: S) => T): Opt<S, ((k: K) => T) & G, M, A, P> {
    return this as any
  }

  mutation<K extends string, T>(key: K, f: (s: S) => F0<void> & F01<T, void>): Opt<S, G, ((k: K) => (t?: T, opt?: CommitOption) => void) & M, A, {type: K, payload?: T} | P>
  mutation<K extends string, T>(key: K, f: (s: S) => F1<T, void>): Opt<S, G, ((k: K) => (t: T, opt?: CommitOption) => void) & M, A, {type: K, payload: T} | P>
  mutation<K extends string, T, F extends (t: T) => void>(key: K, f: (s: S) => F & F1<T, void>): Opt<S, G, ((k: K, opt?: CommitOption) => F) & M, A, {type: K, payload: T} | P>
  {
    return this as any
  }

  action<K extends string, T, R>(key: K, f: (s: ActionStore<S, G, M, A>) => F0<R|Promise<R>> & F1<T,R|Promise<R>>): Opt<S, G, M, ((k: K) => F01<T, Promise<R>>) & A,  P>
  action<K extends string, T, R>(key: K, f: (s: ActionStore<S, G, M, A>) => F1<T,R|Promise<R>>): Opt<S, G, M, ((k: K) => F1<T, Promise<R>>) & A,  P>
  action<K extends string, T, F extends (t: T) => any>(key: K, f: (s: ActionStore<S, G, M, A>) => F & F1<T, any>): Opt<S, G, M, ((k: K) => F) & A,  P>
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
