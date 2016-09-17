import {ActionStore, Store} from './store-as'
import {CommitOption} from './interface'

export type F0<R> = () => R
export type F01<T, R> = (t?: T) => R
export type F1<A, R> = (a: A) => R

interface RawAction<S, G, M, A> {
  (s: ActionStore<S, G, M, A>): F01<any, any|Promise<any>>
}

interface RawActions<S, G, M, A> {
  [k: string]: RawAction<S, G, M, A>
}

interface RawMutation<S> {
  (s: S): F01<any, void>
}

interface RawMutations<S> {
  [k: string]: RawMutation<S>
}

interface RawGetter<S> {
  (s: S): any
}

interface RawGetters<S> {
  [k: string]: RawGetter<S>
}

interface Modules {
  [k: string]: Opt<{}, {}, {}, {}, {}>
}

export type Plugin<S, G, M, A, P> = (s: Store<S, G, M, A, P>) => void

export class Opt<S, G, M, A, P> {

  private _state: S
  private _getters: RawGetters<S>
  private _actions: RawActions<S, G, M, A> = {}
  private _mutations: RawMutations<S> = {}
  private _modules: Modules = {}
  private _plugins: Plugin<S, G, M, A, P>[]
  private _strict = false

  constructor(s: S) {
    this._state = s
  }

  getter<K extends string, T>(key: K, f: (s: S) => T): Opt<S, ((k: K) => T) & G, M, A, P> {
    this._getters[key as string] = f
    return this as any
  }

  mutation<K extends string, T>(key: K, f: (s: S) => F0<void> & F01<T, void>): Opt<S, G, ((k: K) => (t?: T, opt?: CommitOption) => void) & M, A, {type: K, payload?: T} | P>
  mutation<K extends string, T>(key: K, f: (s: S) => F1<T, void>): Opt<S, G, ((k: K) => (t: T, opt?: CommitOption) => void) & M, A, {type: K, payload: T} | P>
  mutation<K extends string, T>(key: K, f: (s: S) => F01<T, void>): Opt<S, G, ((k: K) => (t?: T, opt?: CommitOption) => void) & M, A, {type: K, payload: T} | P>
  {
    this._mutations[key as string] = f
    return this as any
  }

  action<K extends string, T, R>(key: K, f: (s: ActionStore<S, G, M, A>) => F0<R|Promise<R>> & F1<T,R|Promise<R>>): Opt<S, G, M, ((k: K) => F01<T, Promise<R>>) & A,  P>
  action<K extends string, T, R>(key: K, f: (s: ActionStore<S, G, M, A>) => F1<T,R|Promise<R>>): Opt<S, G, M, ((k: K) => F1<T, Promise<R>>) & A,  P>
  action<K extends string, T, R>(key: K, f: (s: ActionStore<S, G, M, A>) => F01<T,R|Promise<R>>): Opt<S, G, M, ((k: K) => F01<T, Promise<R>>) & A,  P>
  {
    this._actions[key as string] = f
    return this as any
  }

  module<K extends string, S1, G1, M1, A1, P1>(key: K, o: Opt<S1, G1, M1, A1, P1>): Opt<S & {readonly $: (k: K) => S1}, G1 & G, M1 & M, A1 & A, P1 | P> {
    this._modules[key as string] = o
    return this as any
  }

  plugin(...plugins: Plugin<S, G, M, A, P>[]): this {
    this._plugins = this._plugins.concat(plugins)
    return this
  }

  strict(flag = true): this {
    this._strict = flag
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
