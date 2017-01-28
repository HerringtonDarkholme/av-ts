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

export type LifecycleDecorator = (target: Vue, method: string) => void
export function Lifecycle(life: Lifecycles): LifecycleDecorator
export function Lifecycle(target: Vue, life: Lifecycles): void
export function Lifecycle(target: Vue | Lifecycles, life?: Lifecycles): LifecycleDecorator | void {
  function makeDecorator(life: Lifecycles): LifecycleDecorator {
    return (target: Vue, method: string) => {
      let lifecycles = target[LIFECYCLE_KEY] = target[LIFECYCLE_KEY] || createMap()
      lifecycles[life] = lifecycles[life] || []
      lifecycles[life].push(method)
    }
  }

  if (target instanceof Vue) {
    return makeDecorator(life!)(target, life!)
  } else {
    return makeDecorator(target)
  }
}

Component.register(LIFECYCLE_KEY, function(proto, instance, options) {
  let lifecycles: string[][] = proto[LIFECYCLE_KEY]
  for (let lifecycle in lifecycles) {
    // lifecycles must be on proto because internalKeys is processed before method
    let methods: string[] = lifecycles[lifecycle]
    // delete proto[lifecycle]
    options[lifecycle] = function(this: Vue) {
      // console.log(this)
      methods.forEach( method => {
        // this[method] does not exist on beforeCreate
        if (this[method]) {
          this[method]()
        } else if (this['$options']) {
          // but maybe we could just always do this one?
          this['$options'].methods![method].bind(this)()
        }
      })
    }
  }
})
