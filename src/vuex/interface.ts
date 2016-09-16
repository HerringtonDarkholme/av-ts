import {Store} from './store'

export interface VuexPlugin {
  (store: Store<{}>): void
}

export interface RawGetter<S, R> {
  (s: S): R
}

export interface RawGetters {
  [k: string]: RawGetter<any, any>
}

export  interface RawMutaionHandler {
  (state: any, payload: any): void
}

export interface ActionContext<S, RS> {
  dispatch<T>(type: string, payload: any): Promise<T> | undefined
  commit(type: string, payload: any, options?: CommitOption): void
  state: S
  getters: {}
  rootState: RS
}

export interface RawActionHandler<S, RS> {
  (ctx: ActionContext<S, RS>, payload: any, cb?: Function): Promise<any>
}


export interface ModuleGetters {
  [k: string]: (state: any, getters: RawGetters, rootState: any) => any
}

export interface StoreOption {
  state?: {}
  plugins?: VuexPlugin[]
  strict?: boolean
  actions?: {[key: string]: RawActionHandler<any, any>}
  mutations?: {[key: string]: RawMutaionHandler}
  getters?: ModuleGetters
  modules?: {[key: string]: StoreOption}
}

export interface CommitOption {
  silent?: boolean
}

export interface  MutationHandler {
  (payload: any): void
}

export interface MutationCollection {
  [key: string]: MutationHandler[]
}

export interface ActionHandler {
  (payload: any, callback?: Function): Promise<any>
}

export interface ActionCollection {
  [key: string]: ActionHandler[]
}

export interface Mutation {
  type: string,
  payload: any
}

export interface Subscriber<P, S> {
  (mutation: P, state: S): void
}

export interface WrappedGetters<S> {
  [key: string]: (store: Store<S>) => any
}
