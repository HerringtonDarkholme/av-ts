import Vue = require('vue');
import { WatchOptions } from 'vue/types/options';
export declare type VuePropDecorator = (target: Vue, key: string) => void;
export declare type WatchDecoratorSub<K extends string> = (target: any, key: string, prop: any) => void;
export declare function WatchSub<K extends string>(keyPath: K, opt?: WatchOptions): WatchDecoratorSub<K>;
