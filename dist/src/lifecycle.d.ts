import Vue = require('vue');
export declare type Lifecycles = 'beforeCreate' | 'created' | 'beforeDestroy' | 'destroyed' | 'beforeMount' | 'mounted' | 'beforeUpdate' | 'updated' | 'activated' | 'deactivated';
export declare function Lifecycle(target: Vue, life: Lifecycles, _: TypedPropertyDescriptor<() => void>): void;
