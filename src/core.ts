/**
 * The basic idea behind Component is marking on prototype
 * and then process these marks to collect options and modify class/instance.
 *
 * A decorator will mark `internalKey` on prototypes, storgin meta information
 * Then register `DecoratorPorcessor` on Component, which will be called in `Component` decorator
 * `DecoratorPorcessor` can execute custom logic based on meta information stored before
 *
 * For non-annotated fields, `Component` will treat them as `methods` and `computed` in `option`
 * instance variable is treated as the return value of `data()` in `option`
 *
 * So a `DecoratorPorcessor` may delete fields on prototype and instance,
 * preventing meta properties like lifecycle and prop to pollute `method` and `data`
 */

import Vue = require('vue')
import {
  VClass, DecoratorPorcessor,
  ComponentOptions, $$Prop,
  ComponentMeta,
} from './interface'

interface Component {
  (ctor: VClass<Vue>): VClass<Vue>
  (config?: ComponentMeta): ClassDecorator
  register(name: $$Prop, logic: DecoratorPorcessor): void
}

// option is a full-blown Vue compatible option
// meta is vue.ts specific type for annotation, a subset of option
function makeOptionsFromMeta(meta: ComponentMeta): ComponentOptions {
  let options: ComponentOptions = meta
  options.props = {}
  options.computed = {}
  options.watch = {}
  return options
}

// given a vue class' prototype, return its internalKeys and normalKeys
// internalKeys are for decorators' use, like $$Prop, $$Lifecycle
// normalKeys are for methods / computed property
function getKeys(proto: any) {
  let protoKeys = Object.getOwnPropertyNames(proto)
  let internalKeys: $$Prop[] = []
  let normalKeys: string[] = []
  for (let key of protoKeys) {
    if (key === 'constructor') {
      continue
    } else if (key.substr(0, 2) === '$$') {
      internalKeys.push(<any>key)
    } else {
      normalKeys.push(key)
    }
  }
  return {
    internalKeys, normalKeys
  }
}

type ProcessorEntries = {
  [k: string]: DecoratorPorcessor|undefined
}

let registeredProcessors: ProcessorEntries = {}

// delegate to processor
function collectInternalProp(propKey: $$Prop, proto: any, instance: Vue, optionsToWrite: ComponentOptions) {
  let processor = registeredProcessors[propKey]
  if (!processor) {
    return
  }
  processor(proto, instance, optionsToWrite)
}

// un-annotated and undeleted methods/getters are handled as `methods` and `computed`
function collectMethodsAndComputed(propKey: string, proto: any, optionsToWrite: ComponentOptions) {
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

// find all undeleted instance property as the return value of data()
function collectData(instance: any, optionsToWrite: ComponentOptions) {
  let keys = Object.keys(instance)
  let ret: any = {}
  for (let key of keys) {
    ret[key] = instance[key]
  }
  // what a closure! :(
  optionsToWrite.data = function() {
    return ret
  }
}

// find proto's superclass' constructor to correctly extend
function findSuper(proto: any): VClass<Vue> {
  // prototype:   {}  -> VueInst -> ParentInst, aka. proto
  // constructor: Vue -> Parent  -> Child
  let superProto = Object.getPrototypeOf(proto)
  let Super = superProto instanceof Vue
    ? (superProto.constructor as VClass<Vue>) // TS does not setup constructor :(
    : Vue
  return Super
}

function Component_(meta: ComponentMeta = {}): ClassDecorator {
  function decorate(cls: VClass<Vue>): VClass<Vue> {
    let instance = new cls()
    let proto = cls.prototype
    let options = makeOptionsFromMeta(meta)

    let {internalKeys, normalKeys} = getKeys(proto)

    for (let protoKey of internalKeys) {
      collectInternalProp(protoKey, proto, instance, options)
    }

    for (let protoKey of normalKeys) {
      collectMethodsAndComputed(protoKey, proto, options)
    }

    // everything on instance is packed into data
    collectData(instance, options)

    let Super = findSuper(proto)
    return Super.extend(options)
  }
  return decorate
}

export var Component: Component = (function(target: ComponentMeta | VClass<Vue>): any {
  if (typeof target === 'function') {
    return Component_()(target)
  }
  return Component_(target)
} as any)

Component.register = function(key: $$Prop, logic: DecoratorPorcessor) {
  registeredProcessors[key] = logic
}
