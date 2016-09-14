import {Store} from './store'

type _ = {}
const devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default function devtoolPlugin (store: Store) {
  if (!devtoolHook) return

  store._devtoolHook = devtoolHook

  devtoolHook.emit('vuex:init', store)

  devtoolHook.on('vuex:travel-to-state', (targetState: _) => {
    store.replaceState(targetState)
  })

  store.subscribe((mutation: _, state: _) => {
    devtoolHook.emit('vuex:mutation', mutation, state)
  })
}
