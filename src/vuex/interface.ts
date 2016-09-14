import {Store} from './store'

export type _ = {}

export interface VuexPlugin {
  (store: Store<_>): void
}
export interface StoreOption {
  state?: {}
  plugins?: VuexPlugin[]
  strict?: boolean
}

export interface MutationOption {
  silent?: boolean
}

export interface  MutationHandler {
  (state: any): void
}

export interface MutationCollection {
  [key: string]: MutationHandler[]
}

export interface ActionContext<S, RS> {
  dispatch<T>(type: string, payload: _): Promise<T>
  commit(type: string, payload: _): void
  state: S
  getters: _
  rootState: RS
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
