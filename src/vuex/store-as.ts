import {Subscriber, RawGetter, CommitOption} from './interface-as'
import {WatchHandler, WatchOption} from '../watch'
import {Opt, RawActions, RawGetters, RawMutations} from './opt'
import {State} from './state'
import devtoolPlugin from './devtool-as'
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
  readonly getters: G = ((k: string) => this._getters[k]()) as any
  readonly state: S

  /** @internal */ _watcherVM = new Vue()
  /** @internal */ _committing = false

  /** @internal */ _getters: Getters = {}
  /** @internal */ _mutations: Mutations = {}
  /** @internal */ _actions: Actions = {}

  /** @internal */ _devtoolHook: any


  private constructor(opt: Opt<S, G, M, A, P>) {
    let state = this.state = State.create(opt._state)
    installModules(this, opt, state)
    opt._plugins.concat(devtoolPlugin).forEach(p => p(this))
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

export type AnyStore = Store<{}, {}, {}, {}, {}>
type AnyOpt = Opt<{}, {}, {}, {}, {}>
function withCommit(store: AnyStore, fn: () => void) {
  const committing = store._committing
  store._committing = true
  fn()
  store._committing = committing
}

function installModules(store: AnyStore, opt: AnyOpt, state: State) {
  const modules = opt._modules
  for (let key of Object.keys(modules)) {
    let moduleOpt = modules[key]
    let subState = state.avtsModuleState[key] = State.create(moduleOpt._state)
    installModules(store, moduleOpt, subState)
  }
  registerGetters(store, opt._getters, state)
  registerMutations(store, opt._mutations, state)
  registerActions(store, opt._actions, state)
}

function registerGetters(store: AnyStore, getters: RawGetters<{}>, state: State) {
  for (let key of Object.keys(getters)) {
    store._getters[key] = () => getters[key](state)
  }
}

function registerMutations(store: AnyStore, mutations: RawMutations<{}>, state: State) {
  const _mutations = store._mutations
  for (let key of Object.keys(mutations)) {
    _mutations[key] = _mutations[key] || []
    const mutation = mutations[key](state)
    _mutations[key].push(mutation)
  }
}

function registerActions(store: AnyStore, actions: RawActions<{}, {}, {}, {}>, state: State) {
  const _actions = store._actions
  for (let key of Object.keys(actions)) {
    _actions[key] = _actions[key] || []
    const action = actions[key]({
      state: state,
      getters: store.getters,
      commit: store.commit,
      dispatch: store.dispatch,
    })
    _actions[key].push(action)
  }
}
