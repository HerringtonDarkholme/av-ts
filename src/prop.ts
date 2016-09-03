import Vue = require('vue')
import {ComponentOptions, PropOptions, VClass, $$Prop} from './interface'
import {Component} from './core'

import {getReflectType} from './util'

type Props = {[k: string]: PropOptions}

const PROP_KEY = '$$Prop' as $$Prop

export function Prop(target: Vue, key: string): void
export function Prop(config: PropOptions): PropertyDecorator
export function Prop(target: any, key?: string): PropertyDecorator | void {
  if (key) {
    let props: Props = target[PROP_KEY] = target[PROP_KEY] || {}
    props[key] = {type: getReflectType(target, key)}
    return
  }
  let config = target
  return function(target: any, key: string) {
    let props: any = target[PROP_KEY] = target[PROP_KEY] || {}
    config.type = config.type || getReflectType(target, key)
    props[key] = config
  }
}

Component.register(PROP_KEY, function(proto, instance, options) {
  let props: Props = proto[PROP_KEY]
  let inst: any = instance
  for (let key in props) {
    let prop = props[key]
    if (inst[key] != null) {
      // TODO, return a snapshot for object/array
      prop.default = inst[key]
      delete inst[key]
    }
  }
  options.props = props
})
