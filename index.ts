import {Vue} from './types/vue'

type Hash<V> = {[k: string]: V}
type VClass<T extends Vue> = {new(): T}

interface ComponentMeta {
  directive?: Hash<string>,
  components?: Hash<VClass<Vue>>,
  functionals?: Hash<Function>,
  filters?: {},
  name?: string,
  delimiter?: [string, string],
}

export function Component(config: ComponentMeta = {}): ClassDecorator {
  return null as any
}

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

