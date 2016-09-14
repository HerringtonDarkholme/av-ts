import {Store} from './store'

export type _ = never

export interface VuexPlugin {
  (store: Store<{}>): void
}

export interface RawGetter {
  [k: string]: Getter<any, any>
}

export  interface RawMutaionHandler {
  (state: any, payload: _): void
}

export interface ActionContext<S, RS> {
  dispatch<T>(type: string, payload: _): Promise<T> | undefined
  commit(type: string, payload: _, options?: MutationOption): void
  state: S
  getters: {}
  rootState: RS
}

export interface RawActionHandler<S, RS> {
  (ctx: ActionContext<S, RS>, payload: _, cb?: Function): Promise<_>
}


export interface ModuleGetters {
  [k: string]: (state: any, getters: RawGetter, rootState: any) => any
}

export interface StoreOption {
  state?: {}
  plugins?: VuexPlugin[]
  strict?: boolean
  actions?: {[key: string]: RawActionHandler<_, _>}
  mutations?: _[]
  getters?: ModuleGetters
  modules?: {[key: string]: StoreOption}
}

export interface MutationOption {
  silent?: boolean
}

export interface  MutationHandler {
  (payload: any): void
}

export interface MutationCollection {
  [key: string]: MutationHandler[]
}

export interface ActionHandler {
  (payload: _, callback?: Function): Promise<_>
}

export interface ActionCollection {
  [key: string]: ActionHandler[]
}

export interface Mutation {
  type: string,
  payload: _
}

export interface Subscriber<S> {
  (mutation: Mutation, state: S): void
}

export interface Getter<S, R> {
  (s: S): R
}
