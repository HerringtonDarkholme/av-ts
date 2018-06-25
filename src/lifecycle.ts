import Vue from 'vue'

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

export type RouterLifecycle =
  'beforeRouteLeave' |
  'beforeRouteUpdate'

export type BeforeRouterEnterLifecycle =
  'beforeRouteEnter'

export declare type NextFunc = (next?: () => void) => void;
export declare type NextFuncVm<T extends Vue = Vue> = ((next?: (vm: T) => void) => void);
export type RouterHandler = (to: any, from: any, next: NextFunc) => void
export type BeforeRouteEnterRouterHandler = (to: any, from: any, next: NextFuncVm) => void

export function Lifecycle(target: Vue, life: Lifecycles, _: ReadonlyPropertyDescriptor<() => void>): void
export function Lifecycle(target: Vue, life: RouterLifecycle, _: ReadonlyPropertyDescriptor<RouterHandler>): void
export function Lifecycle(target: Vue, life: BeforeRouterEnterLifecycle, _: ReadonlyPropertyDescriptor<BeforeRouteEnterRouterHandler>): void
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
