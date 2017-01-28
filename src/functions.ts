// functional isn't decorator, but worth implementing here
import {VClass} from './interface'
import Vue = require('vue')

export function Mix<T extends Vue>(parent: typeof Vue, ...mixins: (typeof Vue)[]): VClass<T> {
  return parent.extend({ mixins }) as any
}

export { Component as Trait } from './core'
export { Component as Mixin } from './core'
