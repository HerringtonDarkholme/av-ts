import Vue = require('vue')
import {
  Hash, VClass, DecoratorPorcessor,
  ComponentOptions
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
  register(name: string, logic: DecoratorPorcessor): void
}

function makeOptionsFromMeta(meta: ComponentMeta): ComponentOptions {
  let options: ComponentOptions = meta
  options.props = {}
  options.computed = {}
  options.watch = {}
  return options
}

// should continue
function collectVueTSInternalProp(propKey: string, proto: any, instance: Vue, optionsToWrite: ComponentOptions): boolean {
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

    let protoKeys = Object.getOwnPropertyNames(proto)

    for (let protoKey of protoKeys) {
      if (protoKey.substr(0, 2) === '$$') {
        collectVueTSInternalProp(protoKey, proto, instance, options)
        continue
      }
      let descriptor = Object.getOwnPropertyDescriptor(proto, protoKey)
      if (descriptor) {
        // handle builtin methods/getters
        collectMethodsAndComputed(protoKey, descriptor, options)
      }
    }

    for (let propKey in instance) {
    }
    return Vue.extend(options)
  }
  return decorate
}

export var Component: Component = Component_ as any

// Component.register = function() {
// }
