import {Subscriber, RawGetter, CommitOption} from './interface'
import {WatchHandler, WatchOption} from '../watch'
import {Opt, RawActions, RawGetters, RawMutations, Modules} from './opt'
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

  private _watcherVM = new Vue()
  private _committing = false

  private _getters: Getters = {}
  private _mutations: Mutations = {}
  private _actions: Actions = {}

  private constructor(
    getters: RawGetters<S>,
    mutations: RawMutations<S>,
    actions: RawActions<S, G, M, A>,
    modules: Modules,
  ) {
    this._installModules(modules)
    this._registerGetters(getters)
    this._registerMutations(mutations)
    this._registerActions(actions)
  }

  static create(getters: any, mutations: any, actions: any, modules: any, plugins: any[]) {
    return new Store(getters, mutations, actions, modules)
  }

  subscribe(fn: Subscriber<P, S>): () => void {
    return function() {
    }
  }

  watch<R>(getter: RawGetter<S, R>, cb: WatchHandler<never, R>, options: WatchOption<never, R>): Function {
    return this._watcherVM.$watch(() => getter(this.state), cb, options)
  }

  replaceState(state: S): void {
    this._withCommit(() => {
    })
  }

  hotUpdate(newOptions: Opt<S, G, M, A, P>): void {
  }

  private _withCommit(fn: () => void) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }

  private _installModules(mods: Modules) {
    mods
  }

  private _registerGetters(getters: RawGetters<S>) {
    for (let key in getters) {
      this._getters[key] = getters[key].bind(null, this.state)
    }
  }

  private _registerMutations(mutations: RawMutations<S>) {
    const _mutations = this._mutations
    for (let key in mutations) {
      _mutations[key] = _mutations[key] || []
      const mutation = mutations[key](this.state)
      _mutations[key].push(mutation)
    }
  }

  private _registerActions(actions: RawActions<S, G, M, A>) {
    const _actions = this._actions
    for (let key in actions) {
      _actions[key] = _actions[key] || []
      const action = actions[key]({
        state: this.state,
        getters: this.getters,
        commit: this.commit,
        dispatch: this.dispatch,
      })
      _actions[key].push(action)
    }
  }

}
