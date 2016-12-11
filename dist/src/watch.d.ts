import Vue = require('vue');
import { WatchOptions } from 'vue/types/options';
export declare type VuePropDecorator = (target: Vue, key: string) => void;
export declare type WatchHandler<T> = (val: T, oldVal: T) => void;
export declare type WatchDecorator<K extends string> = <T>(target: {
    [k in K]: T;
}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void;
export declare function Watch<K extends string>(key: K, opt?: WatchOptions): WatchDecorator<K>;
