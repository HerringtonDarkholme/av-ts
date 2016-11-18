/**
 * The basic idea behind Component is marking on prototype
 * and then process these marks to collect options and modify class/instance.
 *
 * A decorator will mark `internalKey` on prototypes, storgin meta information
 * Then register `DecoratorProcessor` on Component, which will be called in `Component` decorator
 * `DecoratorProcessor` can execute custom logic based on meta information stored before
 *
 * For non-annotated fields, `Component` will treat them as `methods` and `computed` in `option`
 * instance variable is treated as the return value of `data()` in `option`
 *
 * So a `DecoratorProcessor` may delete fields on prototype and instance,
 * preventing meta properties like lifecycle and prop to pollute `method` and `data`
 */

import Vue = require('vue')
import {
  VClass, DecoratorProcessor,
  ComponentOptions, $$Prop,
} from './interface'

import {createMap, hasOwn, NOOP} from './util'

// option is a full-blown Vue compatible option
// meta is vue.ts specific type for annotation, a subset of option
function makeOptionsFromMeta(meta: ComponentOptions<Vue>, name: string): ComponentOptions<Vue> {
  meta.name = name
  for (let key of ['props', 'computed', 'watch', 'methods']) {
    if (!hasOwn(meta, key)) {
      meta[key] = {}
    }
  }
  return meta
}

// given a vue class' prototype, return its internalKeys and normalKeys
// internalKeys are for decorators' use, like $$Prop, $$Lifecycle
// normalKeys are for methods / computed property
function getKeys(proto: Vue) {
  let protoKeys = Object.getOwnPropertyNames(proto)
  let internalKeys: $$Prop[] = []
  let normalKeys: string[] = []
  for (let key of protoKeys) {
    if (key === 'constructor') {
      continue
    } else if (key.substr(0, 2) === '$$') {
      internalKeys.push(key as $$Prop)
    } else {
      normalKeys.push(key)
    }
  }
  return {
    internalKeys, normalKeys
  }
}

let registeredProcessors = createMap<DecoratorProcessor|undefined>()

// delegate to processor
function collectInternalProp(propKey: $$Prop, proto: Vue, instance: Vue, optionsToWrite: ComponentOptions<Vue>) {
  let processor = registeredProcessors[propKey]
  if (!processor) {
    return
  }
  processor(proto, instance, optionsToWrite)
}

// un-annotated and undeleted methods/getters are handled as `methods` and `computed`
function collectMethodsAndComputed(propKey: string, proto: Object, optionsToWrite: ComponentOptions<Vue>) {
  let descriptor = Object.getOwnPropertyDescriptor(proto, propKey)
  if (!descriptor) { // in case original descriptor is deleted
    return
  }
  if (typeof descriptor.value === 'function') {
    optionsToWrite.methods![propKey] = descriptor.value
  } else if (descriptor.get || descriptor.set) {
    optionsToWrite.computed![propKey] = {
      get: descriptor.get,
      set: descriptor.set,
    }
  }
}

const VUE_KEYS = Object.keys(new Vue)
// find all undeleted instance property as the return value of data()
// need to remove Vue keys to avoid cyclic references
function collectData(cls: Function, keys: string[], optionsToWrite: ComponentOptions<Vue>) {
  // already implemented by @Data
  if (optionsToWrite.data) return
  // what a closure! :(
  optionsToWrite.data = function(this: Vue) {
    let selfData = {}
    // create a Vue instance proxy, this pass Vue's this check
    let proxy = Object.create(cls.prototype)
    // for not data property, set as a readonly prop
    // so @Prop does not rewrite it to undefined
    for (let key of Object.keys(this)) {
      if (keys.indexOf(key) > 0) {
        proxy[key] = this[key]
      } else {
        Object.defineProperty(proxy, key, {
          get: () => this[key],
          set: NOOP
        })
      }
    }
    // _init is the only method required for `cls` call
    proxy['_init'] = NOOP
    cls.call(proxy)
    for (let key of keys) {
      if (VUE_KEYS.indexOf(key) === -1) {
        selfData[key] = proxy[key]
      }
    }
    return selfData
  }
}

// find proto's superclass' constructor to correctly extend
function findSuper(proto: Object): VClass<Vue> {
  // prototype:   {}  -> VueInst -> ParentInst, aka. proto
  // constructor: Vue -> Parent  -> Child
  let superProto = Object.getPrototypeOf(proto)
  let Super = superProto instanceof Vue
    ? (superProto.constructor as VClass<Vue>) // TS does not setup constructor :(
    : Vue
  return Super
}

function Component_(meta: ComponentOptions<Vue> = {}): ClassDecorator {
  function decorate(cls: VClass<Vue>): VClass<Vue> {
    Component.inDefinition = true
    let instance = Object.create(Vue.prototype)
    Object.defineProperty(instance, '_init', {
      value: NOOP, enumerable: false
    })
    try {
      cls.call(instance)
    } finally {
      Component.inDefinition = false
    }
    let proto = cls.prototype
    let options = makeOptionsFromMeta(meta, cls['name'])

    let {internalKeys, normalKeys} = getKeys(proto)

    for (let protoKey of internalKeys) {
      collectInternalProp(protoKey, proto, instance, options)
    }

    for (let protoKey of normalKeys) {
      collectMethodsAndComputed(protoKey, proto, options)
    }

    // everything on instance is packed into data
    collectData(cls, Object.keys(instance), options)

    let Super = findSuper(proto)
    return Super.extend(options)
  }
  return decorate
}

export function Component<T extends VClass<Vue>>(ctor: T): T
export function Component(config?: ComponentOptions<Vue>): <T extends VClass<Vue>>(ctor: T) => T
export function Component(target: ComponentOptions<Vue> | VClass<Vue>): any {
  if (typeof target === 'function') {
    return Component_()(target)
  }
  return Component_(target)
}

export namespace Component {
  export function register(key: $$Prop, logic: DecoratorProcessor) {
    registeredProcessors[key] = logic
  }
  export let inDefinition = false
}
