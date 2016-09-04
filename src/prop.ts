import Vue = require('vue')
import {ComponentOptions, PropOptions, VClass, $$Prop} from './interface'
import {Component} from './core'

import {getReflectType} from './util'

const PROP_KEY = '$$Prop' as $$Prop

type Props = {[key: string]: PropOptions}

export function Prop(target: Vue, key: string): void {
  let propKeys: string[] = target[PROP_KEY] = target[PROP_KEY] || []
  propKeys.push(key)
}

Component.register(PROP_KEY, function(proto, instance, options) {
  let propKeys: string[] = proto[PROP_KEY]
  let props: Props = {}

  for (let key of propKeys) {
    let prop: PropOptions = {}
    if (instance[key] != null) {
      prop = instance[key]
      delete instance[key]
    }
    // refill type if not existing, do we need this?
    if (!prop.type) {
      prop.type = getReflectType(proto, key)
    }
    props[key] = prop
  }
  options.props = props
})


type Class<T> = {new (...args: {}[]): T}

interface PropOption<T> {
  type?: Class<T>
  required?: boolean
  default?: T
  defaultFactory?: () => T
  validator?(value: T): boolean
}
export function p<T>(k: Class<T>): T
export function p<T>(k :PropOption<T>): T
export function p<T>(k: Class<T> | PropOption<T>): T {
  if (typeof k === 'function') {
    return {type: k} as any
  }
  return k as any
}
