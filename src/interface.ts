import {Vue} from 'vue/types/vue'
import {VNode, VNodeData} from 'vue/types/vnode'
export {VNode} from 'vue/types/vnode'

export {PropOptions} from 'vue/types/options'
import {ComponentOptions, DirectiveFunction, DirectiveOptions} from 'vue/types/options'
import {PropOptions} from 'vue/types/options'

export {ComponentOptions} from 'vue/types/options'

export type Hash<V> = {[k: string]: V}
export type VClass<T extends Vue> = {new(): T} & (typeof Vue)

export interface DecoratorPorcessor {
  (proto: Vue, instance: Vue, options: ComponentOptions): void
}

export type $$Prop = string & {'$$Prop Brand': never}

export interface ComponentMeta {
  directive?: Hash<DirectiveFunction | DirectiveOptions>,
  components?: Hash<VClass<Vue> | ComponentOptions>,
  functionals?: Hash<FunctionalProps<{}>>,
  filters?: {[key: string]: Function},
  name?: string,
  delimiter?: [string, string],
}

export interface ContextObject<T> {
  readonly props: T;
  readonly children: VNode[];
  readonly slots: Hash<VNode>;
  readonly data: VNodeData;
  readonly parent: VNode;
}
export type RenderFunc<T> = (
  this: never,
  h: typeof Vue.prototype.$createElement,
  context: ContextObject<T>
) => VNode

export type Class = {new(...args: {}[]): {}}

export interface FunctionalProps<T> {
  props?: {[key: string]: PropOptions | Class | Class[] }
  functional: true,
  render: RenderFunc<T>
}
