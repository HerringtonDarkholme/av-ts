import Vue = require('vue')
import {Store, mapGetters, mapActions, mapMutations} from 'vuex'
import {$$Prop} from './interface'
import {Component} from './core'

export type StateFuncs<S> = {[k: string]: ((this: S, ...args: any[]) => any)}
export type StoreFuncs<S, G, M, A> = {
  [k: string]: (this: VStore<S, G, M&S, A>, ...args: any[]) => any
}
export type VStore<S, G, M, A> = {
  state: S
  getters: G
  mutations: M
  actions: A
}

export interface Stateable {
  state<S>(s: S): Getterable<S>
  toStore(): Store<{}>
  toComponentHelper(): VStore<{}, {}, {}, {}>
}

export interface Getterable<S> {
  getters<G>(g: G): Mutationable<S, G>
  toComponentHelper(): VStore<S, {}, {}, {}>
  toStore(): Store<S>
}

export interface Mutationable<S, G> {
  mutations<M extends StateFuncs<S>>(m: M): Actionable<S, G, M>
  toComponentHelper(): VStore<S, G, {}, {}>
  toStore(): Store<S>
}

export interface Actionable<S, G, M> {
  actions<A extends StoreFuncs<S, G, M, {}>>(a: A): Full<S, G, M, A>
  toComponentHelper(): VStore<S, G, M, {}>
  toStore(): Store<S>
}

export interface Full<S, G, M, A> {
  actions<A_ extends StoreFuncs<S, G, M, A>>(a: A_): Full<S, G, M, A_ & A>
  toComponentHelper(): VStore<S, G, M, A>
  toStore(): Store<S>
}

class StoreImpl implements
  Stateable, Getterable<any>, Mutationable<any, any>,
  Actionable<any, any, any>, Full<any, any, any, any> {

  private _config: any
  private _store: Store<any> | undefined

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

  actions(a: any): this {
    let actions: any = {}
    for (let key in a) {
      const action = a[key]
      actions[key] = (store: any, ...args: any[]) => action.apply(store, args)
    }
    this._config.actions = actions
    return this
  }

  toConfig(): any {
    return this._config
  }

  toStore(): Store<any> {
    if (!this._store) {
      this._store = new Store(this._config)
    }
    return this._store
  }

  toComponentHelper(): any {
    let store = this.toStore()
    let config = this._config
    let ret: any = {}
    ret.mutations = mapMutations(Object.keys(config.mutations))
    ret.actions = mapActions(Object.keys(config.actions))
    let getters: any = ret.getters = mapGetters(Object.keys(config.getters))
    for (let key in getters) {
      getters[key] = { get: getters[key] }
    }
    return ret
  }
}

export function create(): Stateable {
  return new StoreImpl()
}

const VUEX_PROP = '$$Vuex' as $$Prop

export function Vuex(target: Vue, key: string): void {
  let vuexProps = target[VUEX_PROP] = target[VUEX_PROP] || []
  vuexProps.push(key)
}

Component.register(VUEX_PROP, function(target, instance, optionsToWrite) {
  let vuexProps: string[] = target[VUEX_PROP]
  for (let key of vuexProps) {
    let handler = target[key]
    if (typeof handler === 'function') {
      optionsToWrite.methods![key] = handler
    } else if (typeof handler === 'object' && handler){
      optionsToWrite.computed![key] = handler.get
    }
    delete instance[key]
  }
})
