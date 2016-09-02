import {Component} from './core'

const LIFECYCLE_KEY = '$$Lifecycle'

type Lifecycles =
  'beforeCreate' | 'created' |
  'beforeDestroy' | 'destroyed' |
  'beforeMount' | 'mounted' |
  'beforeUpdate' | 'updated'

export function Lifecycle(target: Object, life: Lifecycles, _: TypedPropertyDescriptor<() => void>) {
  return null as any
}

Component.register(LIFECYCLE_KEY, function(proto, instance, options) {
  let registeredLifecycle: string[] = proto[LIFECYCLE_KEY]
  for (let lifecycle of registeredLifecycle) {
    // registeredLifecycle may be on proto/methods
    let handler = proto[lifecycle] || options.methods![lifecycle]
    delete proto[lifecycle]
    delete options.methods![lifecycle]
    options[lifecycle] = handler
  }
})
