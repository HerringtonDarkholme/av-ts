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

export interface Mutation {
  type: string
}

export interface MutationOption {
  silent?: boolean
}
