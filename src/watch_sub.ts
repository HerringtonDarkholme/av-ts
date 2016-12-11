import Vue = require('vue')
import {$$Prop} from './interface'
import {Component} from './core'
import {createMap} from './util'
import {WatchOptions} from 'vue/types/options'

export type VuePropDecorator = (target: Vue, key: string) => void

const WATCH_PROP = '$$Watch' as $$Prop


export type WatchDecoratorSub<K extends string> =
  (target: any, key: string, prop: any) => void

export function WatchSub<K extends string>(keyPath: K, opt: WatchOptions = {}): WatchDecoratorSub<K> {
  return function(target: any, method: string) {
    let watchedProps = target[WATCH_PROP] = target[WATCH_PROP] || createMap()
    opt['handler'] = target[method]
    opt['originalMethod'] = method
    watchedProps[keyPath] = opt as any
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
