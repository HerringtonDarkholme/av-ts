import * as Vue from 'vue';
export declare type Lifecycles = 'beforeCreate' | 'created' | 'beforeDestroy' | 'destroyed' | 'beforeMount' | 'mounted' | 'beforeUpdate' | 'updated' | 'activated' | 'deactivated';
export declare type RouterLifecyle = 'beforeRouteEnter' | 'beforeRouteLeave' | 'beforeRouteUpdate';
export declare type NextFunc = ((vm: Vue) => void) | (() => void);
export declare type RouterHandler = (to: any, from: any, next: NextFunc) => void;
export declare function Lifecycle(target: Vue, life: Lifecycles, _: TypedPropertyDescriptor<() => void>): void;
export declare function Lifecycle(target: Vue, life: RouterLifecyle, _: TypedPropertyDescriptor<RouterHandler>): void;
