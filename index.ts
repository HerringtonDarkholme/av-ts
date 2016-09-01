import Vue = require('vue')

export {Component} from './src/core'

export function Prop(config: any = {}): PropertyDecorator {
  return null as any
}

type WatchHandler<C, T> = (this: C, newVal?: any, oldVal?: any) => void

interface WatchOption {
  deep?: boolean
  immediate?: boolean
}

export function Watch<C, T>(func: WatchHandler<C, T>, option: WatchOption = {}): PropertyDecorator {
  return null as any
}

type Lifecycles =
  'beforeCreate' | 'created' |
  'beforeDestroy' | 'destroyed' |
  'beforeMount' | 'mounted' |
  'beforeUpdate' | 'updated'

export function Lifecycle(target: Object, life: Lifecycles, _: TypedPropertyDescriptor<() => void>) {
  return null as any
}

// for type checking only
export function Transition(target: Object, key: string, _: TypedPropertyDescriptor<(e: HTMLElement, done?: Function) => void>) {
}

