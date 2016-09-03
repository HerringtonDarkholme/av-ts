import Vue = require('vue')
import {ComponentOptions, PropOptions, VClass, $$Prop} from './interface'
import {Component} from './core'

import {getReflectType} from './util'

type Props = {[k: string]: PropOptions}

const PROP_KEY = '$$Prop' as $$Prop

export function Prop(target: Vue, key: string): void {
  let props: Props = target[PROP_KEY] = target[PROP_KEY] || {}
  props[key] = {type: getReflectType(target, key)}
}

Component.register(PROP_KEY, function(proto, instance, options) {
  let props: Props = proto[PROP_KEY]
  for (let key in props) {
    let prop = props[key]
    if (instance[key] != null) {
      // TODO, return a snapshot for object/array
      prop.default = instance[key]
      delete instance[key]
    }
  }
  options.props = props
})
