import Vue = require('vue')
import { $$Prop } from './interface'
import {Component} from './core'
import {Context} from './context'

const DATA_KEY = '$$data' as $$Prop

export type Dict = {[k: string]: any}
export function Data(target: Vue, key: 'data', _: TypedPropertyDescriptor<() => Dict>): void
export function Data(target: Vue, key: 'data', _: TypedPropertyDescriptor<(context: Context) => Dict>): void
export function Data(target: Vue, key: 'data', _: TypedPropertyDescriptor<(context: Context) => Dict>): void {
  target[DATA_KEY] = target[key]
}

Component.register(DATA_KEY, (proto, instance, options) => {
  options.data = proto['data']
  delete proto['data']
})

