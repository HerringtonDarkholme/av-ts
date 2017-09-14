import * as Vue from 'vue';
import { WatchOptions } from 'vue/types/options';
export declare type VuePropDecorator = (target: Vue, key: string) => void;
export declare type WatchHandler<T> = (val: T, oldVal: T) => void;
export declare type WatchDecorator<K extends string> = <T>(target: {
    [k in K]?: T;
}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void;
export declare type WatchDecorator2<K1 extends string, K2 extends string> = <T>(target: {
    [k1 in K1]?: {
        [k2 in K2]?: T;
    };
}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void;
export declare type WatchDecorator3<K1 extends string, K2 extends string, K3 extends string> = <T>(target: {
    [k1 in K1]?: {
        [k2 in K2]?: {
            [k3 in K3]?: T;
        };
    };
}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void;
export declare type WatchDecorator4<K1 extends string, K2 extends string, K3 extends string, K4 extends string> = <T>(target: {
    [k1 in K1]?: {
        [k2 in K2]?: {
            [k3 in K3]?: {
                [k4 in K4]?: T;
            };
        };
    };
}, key: string, prop: TypedPropertyDescriptor<WatchHandler<T>>) => void;
export declare function Watch<K1 extends string, K2 extends string, K3 extends string, K4 extends string>(keys: [K1, K2, K3, K4], opt?: WatchOptions): WatchDecorator4<K1, K2, K3, K4>;
export declare function Watch<K1 extends string, K2 extends string, K3 extends string>(keys: [K1, K2, K3], opt?: WatchOptions): WatchDecorator3<K1, K2, K3>;
export declare function Watch<K1 extends string, K2 extends string>(keys: [K1, K2], opt?: WatchOptions): WatchDecorator2<K1, K2>;
export declare function Watch<K extends string>(key: K, opt?: WatchOptions): WatchDecorator<K>;
