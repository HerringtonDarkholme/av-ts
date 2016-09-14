import Vue = require('vue')
import {PropOptions, $$Prop} from './interface'
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


export type Class<T> = {new (...args: {}[]): T}

export interface PlainProp<T> {
  type?: Class<T>
  validator?(value: T): boolean
  required?: boolean
}

export interface DefaultProp<T> extends PlainProp<T> {
  default: T | (() => T)
}

export interface RequiredProp<T> extends PlainProp<T> {
  required: true
  default?: T | (() => T)
}

// FuncPropOption is solely for bad API
export interface FuncProp<T extends Function> {
  type?: FunctionConstructor,
  defaultFunc?: T
  required?: boolean
}

// we cast arugment's config object type into plain data object type
// say, p(Number) has a return type of `number`, but at runtime it is
// {type: Number}. This is solely for API user's conciseness
export function p<T>(tpe: NumberConstructor): number | undefined
export function p<T>(tpe: StringConstructor): string | undefined
export function p<T>(tpe: BooleanConstructor): boolean | undefined
export function p<T>(tpe: Class<T>): T | undefined
export function p<T>(conf: RequiredProp<T>): T
export function p<T>(conf: DefaultProp<T>): T
export function p<T>(conf: PlainProp<T>): T | undefined
export function p<T extends Function>(conf: FuncProp<T>): T
export function p<T>(confOrType: Class<T> | PlainProp<T>): T {
  if (typeof confOrType === 'function') {
    let tpe = confOrType
    return {type: tpe} as any
  }
  let conf: any = confOrType
  if (conf.type === Function) {
    conf.default = conf.defaultFunc
    // TODO: evaluate copying a config rather than delete prop
    delete conf.defaultFunc
  }
  return conf
}
