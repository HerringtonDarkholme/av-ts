import Vue = require('vue')
import {
  VClass, DecoratorPorcessor,
  ComponentOptions, $$Prop,
  ComponentMeta,
} from './interface'

interface Component {
  (config?: ComponentMeta): ClassDecorator
  register(name: $$Prop, logic: DecoratorPorcessor): void
}

function makeOptionsFromMeta(meta: ComponentMeta): ComponentOptions {
  let options: ComponentOptions = meta
  options.props = {}
  options.computed = {}
  options.watch = {}
  return options
}

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

// should continue
function collectInternalProp(propKey: $$Prop, proto: any, instance: Vue, optionsToWrite: ComponentOptions): boolean {
  return false
}

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

function getSuper(proto: any): VClass<Vue> {
  // constructor: Vue -> Parent  -> Child
  // prototype:   {}  -> VueInst -> ParentInst, aka. proto
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

    let Super = getSuper(proto)
    return Super.extend(options)
  }
  return decorate
}

export var Component: Component = Component_ as any

// Component.register = function() {
// }
