import { VClass } from './interface';
import Vue = require('vue');
export declare function Mixin<T extends Vue>(parent: typeof Vue, ...traits: (typeof Vue)[]): VClass<T>;
export { Component as Trait } from './core';
