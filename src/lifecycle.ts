import Vue = require('vue')

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

export function Lifecycle(target: Vue, life: Lifecycles, _: TypedPropertyDescriptor<() => void>) {
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
