// functional isn't decorator, but worth implementing here
import {VClass} from './interface'
import Vue = require('vue')

export type Cls<T> = {new (): T} & (typeof Vue)
export function Mixin<A extends Vue, B extends Vue>(a: VClass<A>, b: VClass<B>): Cls<A & B>
export function Mixin<A extends Vue, B extends Vue, C extends Vue>(a: VClass<A>, b: VClass<B>, c: VClass<C>): Cls<A & B & C>
export function Mixin<A extends Vue, B extends Vue, C extends Vue, D extends Vue>(a: VClass<A>, b: VClass<B>, c: VClass<C>, d: VClass<D>): Cls<A & B & C & D>
export function Mixin<A extends Vue, B extends Vue, C extends Vue, D extends Vue, E extends Vue>(a: VClass<A>, b: VClass<B>, c: VClass<C>, d: VClass<D>, e: VClass<E>): Cls<A & B & C & D & E>
export function Mixin<A extends Vue, B extends Vue, C extends Vue, D extends Vue, E extends Vue, F extends Vue>(a: VClass<A>, b: VClass<B>, c: VClass<C>, d: VClass<D>, e: VClass<E>, f: VClass<F>): Cls<A & B & C & D & E & F>
export function Mixin<A extends Vue, B extends Vue, C extends Vue, D extends Vue, E extends Vue, F extends Vue, G extends Vue>(a: VClass<A>, b: VClass<B>, c: VClass<C>, d: VClass<D>, e: VClass<E>, f: VClass<F>, g: VClass<G>): Cls<A & B & C & D & E & F & G>
export function Mixin<A extends Vue, B extends Vue, C extends Vue, D extends Vue, E extends Vue, F extends Vue, G extends Vue, H extends Vue>(a: VClass<A>, b: VClass<B>, c: VClass<C>, d: VClass<D>, e: VClass<E>, f: VClass<F>, g: VClass<G>, h: VClass<H>): Cls<A & B & C & D & E & F & G & H>
export function Mixin(parent: typeof Vue, ...traits: (typeof Vue)[]): typeof Vue {
  return parent.extend({mixins: traits})
}

export { Component as Trait } from './core'
