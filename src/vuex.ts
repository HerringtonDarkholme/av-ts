export type StateFuncs<S> = {[k: string]: ((this: S, ...args: any[]) => any)}
export type StoreFuncs<S, G, M, A> = {
  [k: string]: (this: Store<S, G, M&S, A>, ...args: any[]) => any
}
export type Store<S, G, M, A> = {
  state: S
  getters: G
  mutations: M
  actions: A
}

// declare class Vuex<S, G, M, A> {
//   state<S1>(s: S1): Vuex<S1 & S, A, M, G>
//   getters<G1>(g: G1): Vuex<S, G1&G, M, A>
//   mutations<M1 extends StateFuncs<S>>(m: M1): Vuex<S, G, M1&M, A>
//   actions<A1 extends StoreFuncs<S, G, M, A>>(a: A1): Vuex<S, G, M, A & A1>
//   static init(): Vuex<{}, {}, {}, {}>
// }

export interface Stateable {
  state<S>(s: S): Getterable<S>
}

export interface Getterable<S> {
  getters<G>(g: G): Mutationable<S, G>
  toStore(): Store<S, {}, {}, {}>
}

export interface Mutationable<S, G> {
  mutations<M extends StateFuncs<S>>(m: M): Actionable<S, G, M>
  toStore(): Store<S, G, {}, {}>
}

export interface Actionable<S, G, M> {
  actions<A extends StoreFuncs<S, G, M, {}>>(a: A): Full<S, G, M, A>
  toStore(): Store<S, G, M, {}>
}

export interface Full<S, G, M, A> {
  actions<A_ extends StoreFuncs<S, G, M, A>>(a: A_): Full<S, G, M, A_ & A>
  toStore(): Store<S, G, M, A>
}

class StoreImpl implements
  Stateable, Getterable<any>, Mutationable<any, any>,
  Actionable<any, any, any>, Full<any, any, any, any> {

  private _config: any
  state(s: any): this {
    this._config.state = s
    return this
  }
  getters(g: any): this {
    let getters: any = {}
    for (let key in g) {
      const getter = Object.getOwnPropertyDescriptor(g, key).get
      if (!getter) continue
      getters[key] = (state: any) => getter.call(state)
    }
    this._config.getters = getters
    return this
  }
  mutations(m: any): this {
    let mutations: any = {}
    for (let key in m) {
      const mutation = m[key]
      mutations[key] = (state: any, ...args: any[]) => mutation.apply(state, args)
    }
    this._config.mutations = mutations
    return this
  }
  actions(a: any): any {
    let actions: any = {}
    for (let key in a) {
      const action = a[key]
      actions[key] = (store: any, ...args: any[]) => action.apply(store, args)
    }
    this._config.actions = actions
    return this
  }
  toStore(): any {
    return this._config
  }
}

export function create(): Stateable {
  return new StoreImpl()
}
