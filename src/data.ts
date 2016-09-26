import Vue = require('vue')
import { $$Prop } from './interface'
import {Component} from './core'

const DATA_KEY = '$$data' as $$Prop

export type Dict = {[k: string]: any}
export function Data(target: Vue, key: "data", _: TypedPropertyDescriptor<() => Dict>): void {
  target[DATA_KEY] = target[key]
}

Component.register(DATA_KEY, (proto, instance, options) => {
  let dataFunc = proto['data']
  options.data = function(this: Vue) {
    return dataFunc.call(this)
  }
  delete proto['data']
})

