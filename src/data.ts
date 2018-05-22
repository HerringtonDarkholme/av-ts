import Vue from 'vue'
import { $$Prop } from './interface'
import {Component} from './core'
import {ReadonlyPropertyDescriptor} from './util'

const DATA_KEY = '$$data' as $$Prop

export type Dict = {[k: string]: any}
export function Data(target: Vue, key: 'data', _: ReadonlyPropertyDescriptor<() => Dict>): void {
  target[DATA_KEY] = target[key]
}

Component.register(DATA_KEY, (proto, instance, options) => {
  let dataFunc = proto['data']
  options.data = function(this: Vue) {
    return dataFunc.call(this)
  }
  delete proto['data']
})

