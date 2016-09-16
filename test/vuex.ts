type Never = (n: never) => never
type F0<R> = () => R
type F1<A, R> = (a: A) => R
type F2<A, B, R> = (a: A, b: B) => R
type F3<A, B, C, R> = (a: A, b: B, c: C) => R
type F4<A, B, C, D, R> = (a: A, b: B, c: C, d: D) => R
type F5<A, B, C, D, E, R> = (a: A, b: B, c: C, d: D, e: E) => R
type F6<A, B, C, D, E, F, R> = (a: A, b: B, c: C, d: D, e: E, f: F) => R
type F7<A, B, C, D, E, F, G, R> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => R
type F8<A, B, C, D, E, F, G, H, R> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => R

declare class Store<S, G, M, A> {
  getter<K extends string, T>(key: K, func: (s: S) => T): Store<S, ((k: K) => T) & G, M, A>
  mutation<K extends string, F extends (...args: any[]) => void>(key: K, func: (s: S) => F): Store<S, G, ((k: K, opt?: {}) => F) & M, A>
  action<K extends string, R, F extends (...args: any[]) => Promise<R>>(k: K, func: (s: this) => F): Store<S, G, M, ((k: K) => F) & A>
  action<K extends string, R>(k: K, func: (s: this) => F0<R>): Store<S, G, M, ((k: K) => F0<Promise<R>>) & A>
  action<K extends string, R, A1>(k: K, func: (s: this) => F1<A1, R>): Store<S, G, M, ((k: K) => F1<A1, Promise<R>>) & A>
  action<K extends string, R, A1, A2>(k: K, func: (s: this) => F2<A1, A2, R>): Store<S, G, M, ((k: K) => F2<A1, A2, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3>(k: K, func: (s: this) => F3<A1, A2, A3, R>): Store<S, G, M, ((k: K) => F3<A1, A2, A3, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4>(k: K, func: (s: this) => F4<A1, A2, A3, A4, R>): Store<S, G, M, ((k: K) => F4<A1, A2, A3, A4, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4, A5>(k: K, func: (s: this) => F5<A1, A2, A3, A4, A5, R>): Store<S, G, M, ((k: K) => F5<A1, A2, A3, A4, A5, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4, A5, A6>(k: K, func: (s: this) => F6<A1, A2, A3, A4, A5, A6, R>): Store<S, G, M, ((k: K) => F6<A1, A2, A3, A4, A5, A6, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4, A5, A6, A7>(k: K, func: (s: this) => F7<A1, A2, A3, A4, A5, A6, A7, R>): Store<S, G, M, ((k: K) => F7<A1, A2, A3, A4, A5, A6, A7, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4, A5, A6, A7, A8>(k: K, func: (s: this) => F8<A1, A2, A3, A4, A5, A6, A7, A8, R>): Store<S, G, M, ((k: K) => F8<A1, A2, A3, A4, A5, A6, A7, A8, Promise<R>>) & A>

  module<K extends string, S1, G1, M1, A1>(k: K, s: Store<S1, G1, M1, A1>): Store<S & {readonly $: (k: K) => S1}, G1 & G, M1 & M, A1 & A>
  static create<S>(s: S): Store<S, Never, Never, Never>

  readonly dispatch: A
  readonly commit: M
  readonly getters: G
  readonly state: S
}

var a = Store.create({test: 123})
  .action("test", s => (k: string) => 123)
  .action("test2", s => () => s.dispatch)
  .action("test3", s => (k: string, h: number) => s.dispatch)

var b = Store.create({myString: '333'})
.mutation('increment', s => () => s.myString += 1)


var c = Store.create({})
  .module("a", a)
  .module("b", b)
  .getter('mytest', s => {
    return s.$('b')
  })
  .action('INCREMENT', s => () => {
  })
