import {Component} from './core'
import {$$Prop} from './interface'

const LIFECYCLE_KEY: $$Prop = '$$Lifecycle' as any

type Lifecycles =
  'beforeCreate' | 'created' |
  'beforeDestroy' | 'destroyed' |
  'beforeMount' | 'mounted' |
  'beforeUpdate' | 'updated'

export function Lifecycle(target: any, life: Lifecycles, _: TypedPropertyDescriptor<() => void>) {
  let lifecycles = target[LIFECYCLE_KEY] = target[LIFECYCLE_KEY] || {}
  lifecycles[life] = true
}

Component.register(LIFECYCLE_KEY, function(proto, instance, options) {
  let lifecycles: string[] = proto[LIFECYCLE_KEY]
  for (let lifecycle in lifecycles) {
    // lifecycles may be on proto/methods
    let handler = proto[lifecycle] || options.methods![lifecycle]
    delete proto[lifecycle]
    delete options.methods![lifecycle]
    options[lifecycle] = handler
  }
})
