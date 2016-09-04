import Vue = require('vue')
import {$$Prop} from './interface'
import {Component} from './core'

type WatchHandler<C, T> = (this: C, newVal?: any, oldVal?: any) => void

interface WatchOption<C, T>{
  deep?: boolean
  immediate?: boolean
  handler?: WatchHandler<C, T>
}

type VuePropDecorator = (target: Vue, key: string) => void

const WATCH_PROP = '$$Watch' as $$Prop

export function Watch<C extends Vue, T>(func: WatchHandler<C, T>, option?: WatchOption<C, T>): VuePropDecorator {
  return function(target: Vue, key: string) {
    let watchedProps = target[WATCH_PROP] = target[WATCH_PROP] || {}
    if (!option) {
      watchedProps[key] = func
      return
    }
    option.handler = func
    watchedProps[key] = option
  }
}

Component.register(WATCH_PROP, function(target, instance, optionsToWrite) {
  let watchedProps = target[WATCH_PROP]
  optionsToWrite.watch = watchedProps
})
