import Vue from 'vue'
import {VNode, $$Prop} from './interface'
import {Component} from './core'

export type RenderFunc = (createElement: typeof Vue.prototype.$createElement) => VNode

const RENDER_KEY = '$$Render' as $$Prop
const RENDER: 'render' = 'render'

export function Render(target: Vue, key: 'render', _: TypedPropertyDescriptor<RenderFunc>) {
  target[RENDER_KEY] = true
}

Component.register(RENDER_KEY, function(proto, instance, options) {
  if (proto[RENDER_KEY]) {
    options[RENDER] = proto[RENDER]
    delete proto[RENDER]
  }
})
