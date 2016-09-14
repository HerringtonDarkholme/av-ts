import devtoolPlugin from './devtool'
import applyMixin from './mixin'

import {
  StoreOption,
  Getter, ModuleGetters,
  MutationOption, MutationCollection, RawMutaionHandler,
  ActionCollection, RawActionHandler,
  Subscriber,

} from './interface'

import {WatchHandler, WatchOption} from '../watch'

let Vue: any // bind on install

export class Store<S> {

  /* @internal */ _committing = false
  /* @internal */ _options: StoreOption
  /* @internal */ _actions: ActionCollection = Object.create(null)
  /* @internal */ _mutations: MutationCollection = Object.create(null)
  /* @internal */ _wrappedGetters = Object.create(null)
  /* @internal */ _runtimeModules: {[key: string]: StoreOption} = Object.create(null)
  /* @internal */ _subscribers: Subscriber<S>[] = []
  /* @internal */ _devtoolHook: any
  /* @internal */ _vm: any

  private _watcherVM = new Vue()

  public strict: boolean
  public getters: {}

  constructor (options: StoreOption = {}) {
    assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
    assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)

    const {
      state = {},
      plugins = [],
      strict = false
    } = options

    // store internal state
    this._options = options

    // strict mode
    this.strict = strict

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], options)

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreVM(this, state)

    // apply plugins
    plugins.concat(devtoolPlugin).forEach(plugin => plugin(this))
  }

  get state (): S {
    return this._vm.state
  }

  set state (v) {
    assert(false, `Use store.replaceState() to explicit replace store state.`)
  }

  commit = (type: string, payload: any, options: MutationOption) => {
    // check object-style commit
    let mutation = { type, payload }
    const entry = this._mutations[type]
    if (!entry) {
      console.error(`[vuex] unknown mutation type: ${type}`)
      return
    }
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })
    if (!options || !options.silent) {
      this._subscribers.forEach(sub => sub(mutation, this.state))
    }
  }

  dispatch = (type: string, payload: any) => {
    const entry = this._actions[type]
    if (!entry) {
      console.error(`[vuex] unknown action type: ${type}`)
      return
    }
    return entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)
  }

  subscribe (fn: Subscriber<S>) {
    const subs = this._subscribers
    if (subs.indexOf(fn) < 0) {
      subs.push(fn)
    }
    return () => {
      const i = subs.indexOf(fn)
      if (i > -1) {
        subs.splice(i, 1)
      }
    }
  }

  watch<R>(getter: Getter<S, R>, cb: WatchHandler<never, R>, options: WatchOption<never, R>) {
    assert(typeof getter === 'function', `store.watch only accepts a function.`)
    return this._watcherVM.$watch(() => getter(this.state), cb, options)
  }

  replaceState (state: S) {
    this._withCommit(() => {
      this._vm.state = state
    })
  }

  registerModule (path: string | string[], module: StoreOption) {
    if (typeof path === 'string') path = [path]
    assert(Array.isArray(path), `module path must be a string or an Array.`)
    this._runtimeModules[path.join('.')] = module
    installModule(this, this.state, path, module)
    // reset store to update getters...
    resetStoreVM(this, this.state)
  }

  unregisterModule (path: string[]) {
    if (typeof path === 'string') path = [path]
    assert(Array.isArray(path), `module path must be a string or an Array.`)
    delete this._runtimeModules[path.join('.')]
    this._withCommit(() => {
      const parentState = getNestedState(this.state, path.slice(0, -1))
      Vue.delete(parentState, path[path.length - 1])
    })
    resetStore(this)
  }

  hotUpdate (newOptions: StoreOption) {
    const options = this._options
    if (newOptions.actions) {
      options.actions = newOptions.actions
    }
    if (newOptions.mutations) {
      options.mutations = newOptions.mutations
    }
    if (newOptions.getters) {
      options.getters = newOptions.getters
    }
    if (newOptions.modules) {
      let modules = options.modules = options.modules || {}
      for (const key in newOptions.modules) {
        modules[key] = newOptions.modules[key]
      }
    }
    resetStore(this)
  }

  _withCommit (fn: () => void) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }
}

function assert (condition: boolean, msg: string) {
  if (!condition) throw new Error(`[vuex] ${msg}`)
}

function resetStore<S>(store: Store<S>) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  const state = store.state
  // init root module
  installModule(store, state, [], store._options, true)
  // init all runtime modules
  Object.keys(store._runtimeModules).forEach(key => {
    installModule(store, state, key.split('.'), store._runtimeModules[key], true)
  })
  // reset vm
  resetStoreVM(store, state)
}

function resetStoreVM<S>(store: Store<S>, state: S) {
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  Object.keys(wrappedGetters).forEach(key => {
    const fn = wrappedGetters[key]
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key]
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: { state },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    // dispatch changes in all subscribed watchers
    // to force getter re-evaluation.
    store._withCommit(() => {
      oldVm.state = null
    })
    Vue.nextTick(() => oldVm.$destroy())
  }
}

function installModule<S>(store: Store<S>, rootState: S, path: string[], module: StoreOption, hot?: boolean) {
  const isRoot = !path.length
  const {
    state,
    actions,
    mutations,
    getters,
    modules
  } = module

  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      Vue.set(parentState, moduleName, state || {})
    })
  }

  if (mutations) {
    Object.keys(mutations).forEach(key => {
      registerMutation(store, key, mutations[key], path)
    })
  }

  if (actions) {
    Object.keys(actions).forEach(key => {
      registerAction(store, key, actions[key], path)
    })
  }

  if (getters) {
    wrapGetters(store, getters, path)
  }

  if (modules) {
    Object.keys(modules).forEach(key => {
      installModule(store, rootState, path.concat(key), modules[key], hot)
    })
  }
}

function registerMutation<S>(store: Store<S>, type: string, handler: RawMutaionHandler, path: string[] = []) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload: any) {
    handler(getNestedState(store.state, path), payload)
  })
}

function registerAction<S, SubState>(store: Store<S>, type: string, handler: RawActionHandler<SubState, S>, path: string[] = []) {
  const entry = store._actions[type] || (store._actions[type] = [])
  const { dispatch, commit } = store
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler({
      dispatch,
      commit,
      getters: store.getters,
      state: getNestedState(store.state, path),
      rootState: store.state
    }, payload, cb)
    // normalize
    res = Promise.resolve(res)
    if (store._devtoolHook) {
      return res.catch((err: any) => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}

function wrapGetters<S>(store: Store<S>, moduleGetters: ModuleGetters, modulePath: string[]) {
  Object.keys(moduleGetters).forEach(getterKey => {
    const rawGetter = moduleGetters[getterKey]
    if (store._wrappedGetters[getterKey]) {
      console.error(`[vuex] duplicate getter key: ${getterKey}`)
      return
    }
    store._wrappedGetters[getterKey] = function wrappedGetter (store: Store<S>) {
      return rawGetter(
        getNestedState(store.state, modulePath), // local state
        store.getters, // getters
        store.state // root state
      )
    }
  })
}

function enableStrictMode<S>(store: Store<S>) {
  store._vm.$watch('state', () => {
    assert(store._committing, `Do not mutate vuex store state outside mutation handlers.`)
  }, { deep: true, sync: true })
}

function getNestedState (state: any, path: string[]) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state
}

function install (_Vue: any) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    )
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  Store,
  install,
}
