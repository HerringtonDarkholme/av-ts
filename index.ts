import {Vue} from './types/vue'

type Hash<V> = {[k: string]: V}
type VClass<T extends Vue> = {new(): T}

interface ComponentMeta {
  directive?: Hash<string>,
  components?: Hash<VClass<Vue>>,
  functionals?: Hash<Function>,
  transitions?: {},
  filters?: {},
  name?: string,
  delimiter?: [string, string],
}

export function Component(config: ComponentMeta): ClassDecorator {
  return null as any
}

export function Prop(config: any = {}): PropertyDecorator {
  return null as any
}


type WatchHandler<C> = (this: C, newVal?: any, oldVal?: any) => void

interface WatchOption {
  deep?: boolean
  immediate?: boolean
}

export function Watch<C>(func: WatchHandler<C>, option: WatchOption = {}): PropertyDecorator {
  return null as any
}

type Lifecycles =
  'beforeCreate' | 'created' |
  'beforeDestroy' | 'destroyed' |
  'beforeMount' | 'mounted' |
  'beforeUpdate' | 'updated'

export function Lifecycle(target: Object, life: Lifecycles) {
  return null as any
}

