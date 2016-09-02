import Vue = require('vue')
import {
  Hash, VClass, DecoratorPorcessor,
  ComponentOptions, $$Prop
} from './interface'

export interface ComponentMeta {
  directive?: Hash<string>,
  components?: Hash<VClass<Vue>>,
  functionals?: Hash<Function>,
  filters?: {},
  name?: string,
  delimiter?: [string, string],
}

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

function collectMethodsAndComputed(propKey: string, descriptor: PropertyDescriptor, optionsToWrite: ComponentOptions) {
  if (typeof descriptor.value === 'function') {
    optionsToWrite.methods![propKey] = descriptor.value
  } else if (descriptor.get || descriptor.set) {
    optionsToWrite.computed![propKey] = {
      get: descriptor.get,
      set: descriptor.set,
    }
  }
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
      let descriptor = Object.getOwnPropertyDescriptor(proto, protoKey)
      if (descriptor) {
        // handle builtin methods/getters
        collectMethodsAndComputed(protoKey, descriptor, options)
      } else {
      }
    }

    // everything on instance is a
    for (let propKey in instance) {
    }
    return Vue.extend(options)
  }
  return decorate
}

export var Component: Component = Component_ as any

// Component.register = function() {
// }
