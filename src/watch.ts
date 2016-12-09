import Vue = require('vue')
import {$$Prop} from './interface'
import {Component} from './core'
import {createMap} from './util'
import {WatchOptions} from 'vue/types/options'

export type VuePropDecorator = (target: Vue, key: string) => void

const WATCH_PROP = '$$Watch' as $$Prop


export type WatchHandler<T> = (val: T, oldVal: T) => void
export type WatchDecorator<K extends string> =
  <T>(target: {[k in K]: T}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void

export function Watch<K extends string>(key: K, opt: WatchOptions = {}): WatchDecorator<K> {
  return function(target: any, method: string) {
    let watchedProps = target[WATCH_PROP] = target[WATCH_PROP] || createMap()
    opt['handler'] = target[method]
    opt['originalMethod'] = method
    watchedProps[key] = opt as any
  }
}

Component.register(WATCH_PROP, function(target, instance, optionsToWrite) {
  let watchedProps = target[WATCH_PROP]
  const watch = optionsToWrite.watch
  for (let key in watchedProps) {
    watch![key] = watchedProps[key]
    delete target[watchedProps[key]['originalMethod']]
  }
})
