import Vue from 'vue'
import {PropOptions, $$Prop} from './interface'
import {Component} from './core'

import {getReflectType, createMap, objAssign} from './util'

const PROP_KEY = '$$Prop' as $$Prop
const PROP_DEF = '$$PropDefault' as $$Prop

export type Constructor = new (...args: any[]) => any

export type PropDec = (target: Vue, key: string) => void
export function Prop(...types: Constructor[]): PropDec
export function Prop(options: PropOptions): PropDec
export function Prop(target: Vue, key: string): void
export function Prop(target: Vue | Constructor, key?: string | Constructor, ...types: Constructor[]): PropDec | void {
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

function makePropDecorator(options: PropOptions = {}): PropDec {
  return (target: Vue, key: string) => {
    let propKeys: {[key: string]: PropOptions} = target[PROP_KEY] = target[PROP_KEY] || {}
    propKeys[key] = options
  }
}

Component.register(PROP_KEY, function(proto, instance, options) {
  let mappedProps: string[] = proto[PROP_KEY]
  let props = options.props = options.props || createMap()

  for (let key in mappedProps) {
    let prop: PropOptions = {}

    if (instance[key] && instance[key][PROP_DEF]) {
      prop.default = instance[key][PROP_DEF]
      prop.type = getReflectType(proto, key)
    }

    else if (instance[key] && typeof instance[key] === 'object') {
      let obj = instance[key]
      prop.default = () => objAssign({}, obj)
      prop.type = Object
    }

    else {
      prop.default = instance[key]
      prop.type = instance[key] == null
                ? getReflectType(proto, key)
                : Object.getPrototypeOf(instance[key]).constructor
    }

    prop.required = instance[key] === undefined
    props[key] = objAssign({}, prop, mappedProps[key])
    delete instance[key]
  }

  options.props = props
})

export function resultOf<T>(fn: () => T): T {
  if (!Component.inDefinition) {
    return undefined as any
  }

  return { [PROP_DEF]: fn } as any
}
