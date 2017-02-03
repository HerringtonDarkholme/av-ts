import Vue = require('vue')
import {PropOptions, $$Prop} from './interface'
import {Component} from './core'

import {getReflectType, createMap, objAssign} from './util'

const PROP_KEY = '$$Prop' as $$Prop
const PROP_MRK = '_$_'

export type Constructor = new (...args: any[]) => any

export type PropDec = (target: Vue, key: string) => void
export function Prop(...types: Constructor[]): PropDec
export function Prop(options: PropOptions): PropDec
export function Prop(target: Vue, key: string): void
export function Prop(target: Vue | Constructor, key?: string | Constructor, ...types: Constructor[]): PropDec | void {
  function makePropDecorator(options: PropOptions = {}): PropDec {
    return (target: Vue, key: string) => {
      let propKeys: {[key: string]: PropOptions} = target[PROP_KEY] = target[PROP_KEY] || {}
      propKeys[key] = options
    }
  }

  if (target instanceof Vue && typeof key === 'string') {
    return makePropDecorator()(target, key)
  }

  if (target instanceof Function) {
    types.push(target)
    if (key instanceof Function) {
      types.push(key)
    }
    return makePropDecorator({type: types})
  }

  return makePropDecorator(target)
}

Component.register(PROP_KEY, function(proto, instance, options) {
  let mappedProps: string[] = proto[PROP_KEY]
  let props = options.props = options.props || createMap()

  for (let key in mappedProps) {
    let prop: PropOptions = {}
    if (instance[key] && instance[key][PROP_MRK]) {
      delete instance[key][PROP_MRK]
      prop = instance[key]
      if (!prop.type) {
        prop.type = getReflectType(proto, key)
      }
    } else if (instance[key]) {
      if (typeof instance[key] === 'object') {
        let obj = instance[key]
        prop.default = () => objAssign({}, obj)
      } else {
        prop.default = instance[key]
      }
      prop.required = prop.default === undefined
      try {
        prop.type = Object.getPrototypeOf(instance[key]).constructor
      } catch (error) {
        prop.type = instance[key].__proto__ ? instance[key].__proto__.constructor : instance[key].constructor
      }
    } else if (instance[key] === null) {
      prop.required = false
      prop.type = getReflectType(proto, key)
    } else {
      prop.required = true
      prop.type = getReflectType(proto, key)
    }

    props[key] = objAssign({}, prop, mappedProps[key])
    delete instance[key]
  }
  options.props = props
})

export function resultOf<T>(fn: () => T): T {
  if (!Component.inDefinition) {
    return undefined as any
  }

  return {
    default: fn,
    [PROP_MRK]: true
  } as any
}
