import { Vue } from 'vue/types/vue';
import { VNode, VNodeData } from 'vue/types/vnode';
export { VNode } from 'vue/types/vnode';
export { PropOptions } from 'vue/types/options';
import { ComponentOptions, FunctionalComponentOptions } from 'vue/types/options';
export { ComponentOptions } from 'vue/types/options';
export declare type Hash<V> = {
    [k: string]: V;
};
export declare type VClass<T extends Vue> = {
    new (): T;
    extend(option: ComponentOptions<Vue> | FunctionalComponentOptions): typeof Vue;
};
export interface DecoratorProcessor {
    (proto: Vue, instance: Vue, options: ComponentOptions<Vue>): void;
}
export declare type $$Prop = string & {
    '$$Prop Brand': never;
};
export interface ContextObject<T> {
    readonly props: T;
    readonly children: VNode[];
    readonly slots: Hash<VNode>;
    readonly data: VNodeData;
    readonly parent: VNode;
}
export declare type Class = {
    new (...args: {}[]): {};
};
