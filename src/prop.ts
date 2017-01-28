import Vue = require('vue')
import {PropOptions, $$Prop} from './interface'
import {Component} from './core'

import {getReflectType, createMap} from './util'

const PROP_KEY = '$$Prop' as $$Prop
const PROP_MRK = '_$_'

export function Prop(target: Vue, key: string): void {
  let propKeys: string[] = target[PROP_KEY] = target[PROP_KEY] || []
  propKeys.push(key)
}

Component.register(PROP_KEY, function(proto, instance, options) {
  let propKeys: string[] = proto[PROP_KEY]
  let props = options.props = options.props || createMap()

  for (let key of propKeys) {
    let prop: PropOptions = {}
    if (instance[key] && instance[key][PROP_MRK]) {
      delete instance[key][PROP_MRK]
      prop = instance[key]
      delete instance[key]
      if (!prop.type) {
        prop.type = getReflectType(proto, key)
      }
    } else if (instance[key]) {
      if (typeof instance[key] === 'object') {
        prop.default = () => instance[key]
      } else {
        prop.default = instance[key]
      }
      prop.required = prop.default === undefined
      try {
        prop.type = Object.getPrototypeOf(instance[key]).constructor
      } catch (error) {
        prop.type = instance[key].__proto__ ? instance[key].__proto__.constructor : instance[key].constructor
      }
      delete instance[key]
    } else {
      prop.required = true
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
  default?: T
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
  if (!Component.inDefinition) {
    return undefined as any
  }
  if (typeof confOrType === 'function') {
    return {type: confOrType, _$_: true} as any
  }
  confOrType[PROP_MRK] = true
  return confOrType as any
}

export function resultOf<T>(fn: () => T): T {
  if (!Component.inDefinition) {
    return undefined as any
  }

  return {
    default: fn,
    [PROP_MRK]: true
  } as any
}
