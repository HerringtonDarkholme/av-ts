import * as Vue from 'vue'

import {Component} from './core'
import {$$Prop} from './interface'
import {createMap} from './util'

const LIFECYCLE_KEY = '$$Lifecycle' as $$Prop

export type Lifecycles =
  'beforeCreate' | 'created' |
  'beforeDestroy' | 'destroyed' |
  'beforeMount' | 'mounted' |
  'beforeUpdate' | 'updated' |
  'activated' | 'deactivated'

export type RouterLifecyle =
  'beforeRouteEnter' |
  'beforeRouteLeave' |
  'beforeRouteUpdate'

export type NextFunc = ((vm: Vue) => void) | (() => void)
export type RouterHandler = (to: any, from: any, next: NextFunc) => void

export function Lifecycle(target: Vue, life: Lifecycles, _: TypedPropertyDescriptor<() => void>): void
export function Lifecycle(target: Vue, life: RouterLifecyle, _: TypedPropertyDescriptor<RouterHandler>): void
export function Lifecycle(target: Vue, life: string, _: TypedPropertyDescriptor<Function>) {
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
