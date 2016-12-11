import Vue = require('vue')

export {Component} from './src/core'
export {Lifecycle} from './src/lifecycle'
export {Prop, p} from './src/prop'
export {Render} from './src/render'
export {Transition} from './src/transition'
export {Watch} from './src/watch'
export {WatchSub} from './src/watch_sub'
export {Data} from './src/data'
export * from './src/functions'

export type CreateElement = typeof Vue.prototype.$createElement
export { Vue }
