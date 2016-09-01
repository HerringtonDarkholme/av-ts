import Vue = require('vue')

import {Hash, VClass} from './interface'

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
  register(): void
}

function Component_(config: ComponentMeta = {}): ClassDecorator {
  function decorate(cls: Function): any {
    return Vue.extend(config)
  }
  return decorate
}

export var Component: Component = Component_ as any

Component.register = function() {
}
