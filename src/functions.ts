// functional isn't decorator, but worth implementing here
import {VClass} from './interface'
import Vue = require('vue')

export function Mixin<T extends Vue>(parent: typeof Vue, ...traits: (typeof Vue)[]): VClass<T> {
  return parent.extend({mixins: traits}) as any
}

export { Component as Trait } from './core'
