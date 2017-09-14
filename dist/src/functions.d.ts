import { VClass as Cls } from './interface';
import * as Vue from 'vue';
export declare function Mixin<A>(parent: Cls<A>): Cls<A>;
export declare function Mixin<A, B>(parent: Cls<A>, trait: Cls<B>): Cls<A & B>;
export declare function Mixin<A, B, C>(parent: Cls<A>, trait: Cls<B>, trait1: Cls<C>): Cls<A & B & C>;
export declare function Mixin<A, B, C, D>(parent: Cls<A>, trait: Cls<B>, trait1: Cls<C>, trait3: Cls<D>): Cls<A & B & C & D>;
export declare function Mixin<T>(parent: Cls<Vue>, ...traits: Cls<Vue>[]): Cls<T>;
export { Component as Trait } from './core';
