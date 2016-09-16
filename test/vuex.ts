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

interface Store<S, G, M, A> {
  readonly dispatch: A
  readonly commit: M
  readonly getters: G
  readonly state: S
}

declare class Opt<S, G, M, A> {
  getter<K extends string, T>(key: K, f: (s: S) => T): Opt<S, ((k: K) => T) & G, M, A>
  mutation<K extends string, F extends (...args: any[]) => void>(key: K, f: (s: S) => F): Opt<S, G, ((k: K, opt?: {}) => F) & M, A>
  action<K extends string, R, F extends (...args: any[]) => Promise<R>>(k: K, f: (s: Store<S, G, M, A>) => F): Opt<S, G, M, ((k: K) => F) & A>
  action<K extends string, R>(k: K, f: (s: Store<S, G, M, A>) => F0<R>): Opt<S, G, M, ((k: K) => F0<Promise<R>>) & A>
  action<K extends string, R, A1>(k: K, f: (s: Store<S, G, M, A>) => F1<A1, R>): Opt<S, G, M, ((k: K) => F1<A1, Promise<R>>) & A>
  action<K extends string, R, A1, A2>(k: K, f: (s: Store<S, G, M, A>) => F2<A1, A2, R>): Opt<S, G, M, ((k: K) => F2<A1, A2, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3>(k: K, f: (s: Store<S, G, M, A>) => F3<A1, A2, A3, R>): Opt<S, G, M, ((k: K) => F3<A1, A2, A3, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4>(k: K, f: (s: Store<S, G, M, A>) => F4<A1, A2, A3, A4, R>): Opt<S, G, M, ((k: K) => F4<A1, A2, A3, A4, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4, A5>(k: K, f: (s: Store<S, G, M, A>) => F5<A1, A2, A3, A4, A5, R>): Opt<S, G, M, ((k: K) => F5<A1, A2, A3, A4, A5, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4, A5, A6>(k: K, f: (s: Store<S, G, M, A>) => F6<A1, A2, A3, A4, A5, A6, R>): Opt<S, G, M, ((k: K) => F6<A1, A2, A3, A4, A5, A6, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4, A5, A6, A7>(k: K, f: (s: Store<S, G, M, A>) => F7<A1, A2, A3, A4, A5, A6, A7, R>): Opt<S, G, M, ((k: K) => F7<A1, A2, A3, A4, A5, A6, A7, Promise<R>>) & A>
  action<K extends string, R, A1, A2, A3, A4, A5, A6, A7, A8>(k: K, f: (s: Store<S, G, M, A>) => F8<A1, A2, A3, A4, A5, A6, A7, A8, R>): Opt<S, G, M, ((k: K) => F8<A1, A2, A3, A4, A5, A6, A7, A8, Promise<R>>) & A>

  module<K extends string, S1, G1, M1, A1>(k: K, s: Opt<S1, G1, M1, A1>): Opt<S & {readonly $: (k: K) => S1}, G1 & G, M1 & M, A1 & A>

  done(): Store<S, G, M, A>
  static create<S>(s: S): Opt<S, Never, Never, Never>
}

var a = Opt.create({test: 123})
  .action("test", s => (k: string) => 123)
  .action("test2", s => () => s.dispatch)
  .action("test3", s => (k: string, h: number) => s.dispatch)
  .mutation('addNewProduct', s => () => s.test += 1)

var b = Opt.create({myString: '333'})
.mutation('increment', s => () => s.myString += 1)
.mutation('decrement', s => () => s.myString += 1)


var c = Opt.create({})
  .module("a", a)
  .module("b", b)
  .getter('mytest', s => {
    return s.$('b')
  })
  .action('INCREMENT', s => () => {
  })

var cmt = c.done().commit
