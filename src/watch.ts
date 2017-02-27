import Vue from 'vue'
import {$$Prop} from './interface'
import {Component} from './core'
import {createMap} from './util'
import {WatchOptions} from 'vue/types/options'

export type VuePropDecorator = (target: Vue, key: string) => void

const WATCH_PROP = '$$Watch' as $$Prop


export type WatchHandler<T> = (val: T, oldVal: T) => void
export type WatchDecorator<K extends string> =
  <T>(target: {[k in K]: T}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void
export type WatchDecorator2<K1 extends string, K2 extends string> =
  <T>(target: {[k1 in K1]: {[k2 in K2]: T}}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void
export type WatchDecorator3<K1 extends string, K2 extends string, K3 extends string> =
  <T>(target: {[k1 in K1]: {[k2 in K2]: {[k3 in K3]: T}}}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void
export type WatchDecorator4<K1 extends string, K2 extends string, K3 extends string, K4 extends string> =
  <T>(target: {[k1 in K1]: {[k2 in K2]: {[k3 in K3]: {[k4 in K4]: T}}}}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void

export function Watch<K1 extends string, K2 extends string, K3 extends string, K4 extends string>(keys: [K1, K2, K3, K4], opt?: WatchOptions): WatchDecorator4<K1, K2, K3, K4>
export function Watch<K1 extends string, K2 extends string, K3 extends string>(keys: [K1, K2, K3], opt?: WatchOptions): WatchDecorator3<K1, K2, K3>
export function Watch<K1 extends string, K2 extends string>(keys: [K1, K2], opt?: WatchOptions): WatchDecorator2<K1, K2>
export function Watch<K extends string>(key: K, opt?: WatchOptions): WatchDecorator<K>
export function Watch(keyOrPath: string | string[], opt: WatchOptions = {}): WatchDecorator<string> {
  let key = Array.isArray(keyOrPath) ? keyOrPath.join('.') : keyOrPath
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
