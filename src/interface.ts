import {ComponentOptions as ComponentOptions_} from 'vue/types/options'
import {Vue} from 'vue/types/vue'

export type Hash<V> = {[k: string]: V}
export type VClass<T extends Vue> = {new(): T}

export interface DecoratorPorcessor {
  (proto: any, instance: Vue, options: ComponentOptions): void
}

export type $$Prop = string

export interface ComponentOptions extends ComponentOptions_ {
  [k: string]: any
}
