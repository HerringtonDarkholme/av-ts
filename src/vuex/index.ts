import Vue = require('vue')
import {$$Prop} from '../interface'
import {Component} from '../core'
import {Store} from './store'

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

export interface Full<S, G, M, A> {
  module<S_, G_, M_, A_>(name: string, m: Full<S_, G_, M_, A_>): Full<S, G_&G, M_&M, A_&A>
  subState<Sub>(sub: Sub): Full<Sub&S, G, M, A>
  state<S_>(s: S_): Full<S_&S, G, M, A>
  getters<G_>(g: G_): Full<S, G_&G, M, A>
  mutations<M_ extends StateFuncs<S>>(m: M_): Full<S, G, M_&M, A>
  actions<A_ extends StoreFuncs<S, G, M, A>>(a: A_): Full<S, G, M, A_&A>
  toComponentHelper(): VStore<S, G, M, A>
  toStore(): Store<S>
  toConfig: any
  stateType: S
}

class StoreImpl implements Full<any, any, any, any> {

  private _config = {
    module: {},
    state: {},
    getters: {},
    mutations: {},
    actions: {}
  }
  private _store: Store<any> | undefined
  stateType: any

  module(name:string, m: any): this {
    this._config.module[name] = m.toStore()
    return this
  }

  // for typing only
  subState(m: any): this {
    return this
  }

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
    let ret: any = {}
    return ret
  }
}

export function create(): Full<{}, {}, {}, {}> {
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
