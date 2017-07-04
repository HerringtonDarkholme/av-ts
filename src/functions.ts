// functional isn't decorator, but worth implementing here
import { VClass as Cls } from './interface'
import * as Vue from 'vue'

export function Mixin<A>(parent: Cls<A>): Cls<A>
export function Mixin<A, B>(parent: Cls<A>, trait: Cls<B>): Cls<A&B>
export function Mixin<A, B, C>(parent: Cls<A>, trait: Cls<B>, trait1: Cls<C>): Cls<A&B&C>
export function Mixin<A, B, C, D>(parent: Cls<A>, trait: Cls<B>, trait1: Cls<C>, trait3: Cls<D>): Cls<A&B&C&D>
export function Mixin<T>(parent: Cls<T>, ...traits: (typeof Vue)[]): Cls<T>
export function Mixin<T>(parent: Cls<T>, ...traits: (typeof Vue)[]): Cls<T> {
  return parent.extend({mixins: traits}) as any
}

export { Component as Trait } from './core'
