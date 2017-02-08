import * as Vue from 'vue'
import {$$Prop} from './interface'
import { Component } from './core'
import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'

const STATE_KEY    = '$$State'    as $$Prop
const GETTER_KEY   = '$$Getter'   as $$Prop
const ACTION_KEY   = '$$Action'   as $$Prop
const MUTATION_KEY = '$$Mutation' as $$Prop

export type VuexDecorator = <V extends Vue> (proto: V, key: string) => void

export type StateTransformer = (state: any, getters: any) => any

export type MapHelper = typeof mapState | typeof mapGetters
  | typeof mapActions | typeof mapMutations

export interface BindingOptions {
  namespace?: string
}

export interface BindingHelper {
  <V extends Vue> (proto: V, key: string): void
  (type: string, options?: BindingOptions): VuexDecorator
}

export interface StateBindingHelper extends BindingHelper {
  (type: StateTransformer, options?: BindingOptions): VuexDecorator
}

export const State = createBindingHelper(STATE_KEY, 'computed', mapState) as StateBindingHelper

export const Getter = createBindingHelper(GETTER_KEY, 'computed', mapGetters)

export const Action = createBindingHelper(ACTION_KEY, 'methods', mapActions)

export const Mutation = createBindingHelper(MUTATION_KEY, 'methods', mapMutations)

export function namespace <T extends BindingHelper> (
  namespace: string,
  helper: T
): T {
  // T is BindingHelper or StateBindingHelper
  function namespacedHelper (proto: Vue, key: string): void
  function namespacedHelper (type: any, options?: BindingOptions): VuexDecorator
  function namespacedHelper (a: Vue | any, b?: string | BindingOptions): VuexDecorator | void {
    if (typeof b === 'string') {
      const key: string = b
      const proto: Vue = a
      return helper(key, { namespace })(proto, key)
    }

    const type = a
    const options = merge(b || {}, { namespace })
    return helper(type, options)
  }

  return namespacedHelper as T
}

function createBindingHelper (
  propKey: $$Prop,
  bindTo: 'computed' | 'methods',
  mapFn: MapHelper
): BindingHelper {
  function makeDecorator (map: any, namespace: string | undefined) {
    Component.register(propKey, (proto, instance, options) => {
      let keys: string[] = proto[propKey]

      if (!options[bindTo]) {
        options[bindTo] = {}
      }

      for (let key of keys) {
        const mapObject = { [key]: map }

        options[bindTo]![key] = namespace !== undefined
          ? mapFn(namespace, mapObject)[key]
          : mapFn(mapObject)[key]
        }
    })

    return (target: Vue, key: string) => {
      (target[propKey] = target[propKey] || []).push(key)
    }
  }

  function helper (proto: Vue, key: string): void
  function helper (type: any, options?: BindingOptions): VuexDecorator
  function helper (a: Vue | any, b?: string | BindingOptions): VuexDecorator | void {
    if (typeof b === 'string') {
      const key: string = b
      const proto: Vue = a
      return makeDecorator(key, undefined)(proto, key)
    }

    const namespace = extractNamespace(b)
    const type = a
    return makeDecorator(type, namespace)
  }

  return helper
}

function extractNamespace (options: BindingOptions | undefined): string | undefined {
  const n = options && options.namespace

  if (typeof n !== 'string') {
    return undefined
  }

  if (n[n.length - 1] !== '/') {
    return n + '/'
  }

  return n
}

function merge <T, U> (a: T, b: U): T & U {
  const res: any = {}
  ;[a, b].forEach((obj: any) => {
    Object.keys(obj).forEach(key => {
      res[key] = obj[key]
    })
  })
  return res
}