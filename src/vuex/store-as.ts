import {Subscriber, RawGetter, CommitOption} from './interface-as'
import {WatchHandler, WatchOption} from '../watch'
import {Opt, RawActions, RawGetters, RawMutations} from './opt'
import {State, getSubState} from './state'
import Vue = require('vue')

export interface ActionStore<S, G, M, A> {
  readonly dispatch: A
  readonly commit: M
  readonly getters: G
  readonly state: S
}

interface Getters {
  [k: string]: () => any
}

interface Mutations {
  [k: string]: Array<(t?: any, o?: CommitOption) => void>
}

interface Actions {
  [k: string]: Array<(t?: any) => Promise<any>>
}

export class Store<S, G, M, A, P> implements ActionStore<S, G, M, A> {
  readonly dispatch: A
  readonly commit: M
  readonly getters: G
  readonly state: S

  /** @internal */ _watcherVM = new Vue()
  /** @internal */ _committing = false

  /** @internal */ _getters: Getters = {}
  /** @internal */ _mutations: Mutations = {}
  /** @internal */ _actions: Actions = {}

  private constructor(opt: Opt<S, G, M, A, P>) {
    installModules(this, opt, /*paths*/[])
  }

  static create<S, G, M, A, P>(opt: Opt<S, G, M, A, P>) {
    return new Store(opt)
  }

  subscribe(fn: Subscriber<P, S>): () => void {
    return function() {
    }
  }

  watch<R>(getter: RawGetter<S, R>, cb: WatchHandler<never, R>, options: WatchOption<never, R>): Function {
    return this._watcherVM.$watch(() => getter(this.state), cb, options)
  }

  replaceState(state: S): void {
    withCommit(this, () => {
    })
  }

}

type AnyStore = Store<{}, {}, {}, {}, {}>
type AnyOpt = Opt<{}, {}, {}, {}, {}>
function withCommit(store: AnyStore, fn: () => void) {
  const committing = store._committing
  store._committing = true
  fn()
  store._committing = committing
}

function installModules(store: AnyStore, opt: AnyOpt, path: string[]) {
  registerGetters(store, opt._getters, path)
  registerMutations(store, opt._mutations, path)
  registerActions(store, opt._actions, path)
}

function registerGetters(store: AnyStore, getters: RawGetters<{}>, path: string[]) {
  for (let key of Object.keys(getters)) {
    store._getters[key] = getters[key].bind(null, store.state)
  }
}

function registerMutations(store: AnyStore, mutations: RawMutations<{}>, path: string[]) {
  const _mutations = store._mutations
  for (let key of Object.keys(mutations)) {
    _mutations[key] = _mutations[key] || []
    const mutation = mutations[key](store.state)
    _mutations[key].push(mutation)
  }
}

function registerActions(store: AnyStore, actions: RawActions<{}, {}, {}, {}>, path: string[]) {
  const _actions = store._actions
  for (let key of Object.keys(actions)) {
    _actions[key] = _actions[key] || []
    const action = actions[key]({
      state: store.state,
      getters: store.getters,
      commit: store.commit,
      dispatch: store.dispatch,
    })
    _actions[key].push(action)
  }
}
