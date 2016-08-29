import {Vue} from './types/vue'

type Hash<V> = {[k: string]: V}
type VClass<T extends Vue> = {new(): T}

interface ComponentMeta {
  directive: Hash<string>,
  components: Hash<VClass<Vue>>,
  functionals: Hash<Function>,
  transitions: {},
  filters: {},
  name: string,
  delimiter: [string, string],
}

export function Component(config: ComponentMeta): ClassDecorator {
  return null
}

export function Prop(config: any = {}): PropertyDecorator {
  return null
}


type WatchHandler<C> = <T>(this: C, newVal: T, oldVal: T) => void

interface WatchOption {
  deep?: boolean
  immediate?: boolean
}

export function Watch<C>(func: WatchHandler<C>, option: WatchOption = {}): PropertyDecorator {
  return null
}

type Lifecycles =
  'beforeCreate' | 'created' |
  'beforeDestroy' | 'destroyed' |
  'beforeMount' | 'mounted' |
  'beforeUpdate' | 'updated'

export function Lifecycle(life?: Lifecycles): PropertyDecorator {
  return null
}
