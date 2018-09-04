import Vue from 'vue'
import { RawLocation } from 'vue-router'

import {Component} from './core'
import {$$Prop} from './interface'
import {createMap, ReadonlyPropertyDescriptor} from './util'

const LIFECYCLE_KEY = '$$Lifecycle' as $$Prop

export type Lifecycles =
  'beforeCreate' | 'created' |
  'beforeDestroy' | 'destroyed' |
  'beforeMount' | 'mounted' |
  'beforeUpdate' | 'updated' |
  'activated' | 'deactivated'

export type RouterLifecycle = 'beforeRouteUpdate'|'beforeRouteLeave'
export type BeforeRouteEnterLifecycle = 'beforeRouteEnter'

export declare type NextFunc = (to?: RawLocation | Error | false) => void;
export declare type NextFuncVm<T extends Vue> = (to?: RawLocation | Error | false | ((vm: T) => any)) => void;
export type RouteHandler = (to: any, from: any, next: NextFunc) => void
export type RouteHandlerVm<T extends Vue> = (to: any, from: any, next: NextFuncVm<T>) => void

export function Lifecycle(target: Vue, life: Lifecycles, _: ReadonlyPropertyDescriptor<() => void>): void
export function Lifecycle(target: Vue, life: RouterLifecycle, _: ReadonlyPropertyDescriptor<RouteHandler>): void
export function Lifecycle<T extends Vue>(target: T, life: BeforeRouteEnterLifecycle, _: ReadonlyPropertyDescriptor<RouteHandlerVm<T>>): void
export function Lifecycle(target: Vue, life: string, _: ReadonlyPropertyDescriptor<(...args: any[]) => void>) {
  let lifecycles = target[LIFECYCLE_KEY] = target[LIFECYCLE_KEY] || createMap()
  lifecycles[life] = true
}

Component.register(LIFECYCLE_KEY, function(proto, instance, options) {
  let lifecycles: string[] = proto[LIFECYCLE_KEY]
  for (let lifecycle in lifecycles) {
    // lifecycles must be on proto because internalKeys is processed before method
    let handler = proto[lifecycle]
    delete proto[lifecycle]
    options[lifecycle] = handler
  }
})
