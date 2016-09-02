import {ComponentOptions as ComponentOptions_} from 'vue/types/options'
import {Vue} from 'vue/types/vue'
import {VNode} from 'vue/types/vnode'

export {PropOptions} from 'vue/types/options'

export type Hash<V> = {[k: string]: V}
export type VClass<T extends Vue> = {new(): T} & (typeof Vue)

export interface DecoratorPorcessor {
  (proto: any, instance: Vue, options: ComponentOptions): void
}

export type $$Prop = string & {'$$Prop Brand': never}

export interface ComponentOptions extends ComponentOptions_ {
  [k: string]: any
}

export interface ComponentMeta {
  directive?: Hash<string>,
  components?: Hash<VClass<Vue>>,
  functionals?: Hash<RenderFunc>,
  filters?: {},
  name?: string,
  delimiter?: [string, string],
}

interface ContextObject {
  readonly props: any;
  readonly children: VNode[];
  readonly slots: any;
  readonly data: any;
  readonly parent: VNode;
}
export type RenderFunc = (
  this: never,
  h: typeof Vue.prototype.$createElement,
  context: ContextObject
) => VNode
