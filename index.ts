import Vue = require('vue')

export {Component} from './src/core'
export {Lifecycle} from './src/lifecycle'
export {Prop, p, resultOf} from './src/prop'
export {Render} from './src/render'
export {Transition} from './src/transition'
export {Watch} from './src/watch'
export {Data} from './src/data'
export * from './src/functions'
export * from './src/aliases'

export type CreateElement = typeof Vue.prototype.$createElement
export { Vue }
