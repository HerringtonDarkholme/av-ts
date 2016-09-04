import {
  Component, Prop, Watch,
  Lifecycle, p
} from '../index'

import 'reflect-metadata'

import {
  VClass
} from '../src/interface'

import Vue = require('vue')

@Component
class MyMixin extends Vue {
  private k: string
}

@Component({
  directive: {},
  components: {},
  functionals: {},
  filters: {},
  name: 'my-component',
  delimiter: ['{{', '}}'],
})
export class MyComponent extends Vue {
  myData = '123'
  @Prop myProp = p(Function)
  @Prop complext = p({
    type: Object,
    required: true,
    default() {
      return {a: 123, b: 456}
    }
  })
  @Prop screwed = p({
    type: Function,
    // bug: TS cannot infer return type
    defaultFunc(a: number): boolean {
      return false
    }
  })

  myMethod() {
  }

  get myGetter() {
    return this.myProp
  }

  @Watch<MyComponent, string>(function(){
    console.log(this.myData)
  })
  myWatchee: string

  // instance property reification
  $parent: MyMixin
  $refs: {
    mychild: Vue
  }
  $el: HTMLDivElement

  // lifecycle
  @Lifecycle beforeCreate() {}
  // as method
  created() {}

  // extensibility, like vuex

  // needs updating for Vuex2
  // @Vuex readonly getter2 = getter(s => s.whatever)

  // @Vuex
  // readonly action2 = action(s => s.dispatch('action2'))
}

var a = new MyComponent()

var testVClass: VClass<MyComponent> = MyComponent
