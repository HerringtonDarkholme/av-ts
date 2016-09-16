import Vue = require('vue')
import {$$Prop} from '../interface'
import {Component} from '../core'

const VUEX_PROP = '$$Vuex' as $$Prop

export function Vuex(target: Vue, key: string): void {
  let vuexProps = target[VUEX_PROP] = target[VUEX_PROP] || []
  vuexProps.push(key)
}

Component.register(VUEX_PROP, function(target, instance, optionsToWrite) {
  let vuexProps: string[] = target[VUEX_PROP]
  for (let key of vuexProps) {
    let handler = target[key]
    if (typeof handler === 'function') {
      optionsToWrite.methods![key] = handler
    } else if (typeof handler === 'object' && handler){
      optionsToWrite.computed![key] = handler.get
    }
    delete instance[key]
  }
})
