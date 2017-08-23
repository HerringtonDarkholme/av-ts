import {Vue} from 'vue/types/vue'
import {VNode, VNodeData} from 'vue/types/vnode'
export {VNode} from 'vue/types/vnode'

export {PropOptions} from 'vue/types/options'
import {ComponentOptions, FunctionalComponentOptions} from 'vue/types/options'

export {ComponentOptions} from 'vue/types/options'

export type Hash<V> = {[k: string]: V}
export type VClass<T> = {
  new(): T
  extend(option: ComponentOptions<Vue> | FunctionalComponentOptions): typeof Vue
} & Pick<typeof Vue, keyof typeof Vue>

export interface DecoratorProcessor {
  (proto: Vue, instance: Vue, options: ComponentOptions<Vue>): void
}

export type $$Prop = string & {'$$Prop Brand': never}

export interface ContextObject<T> {
  readonly props: T;
  readonly children: VNode[];
  readonly slots: Hash<VNode>;
  readonly data: VNodeData;
  readonly parent: VNode;
}

export type Class = {new(...args: {}[]): {}}
