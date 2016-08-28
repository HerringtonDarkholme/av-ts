declare var Component: any
declare var Prop: any
declare function Watch<T>(...args)
declare var Lifecycle: any
declare var VueTS: {
  mix: <T>(...args: {new(): T}[]) => {new(): T}
}
interface VueTS {
  'VueTS brand': never
}

declare var Vuex: any
declare var getter: any
declare var action: any

@Component({})
class MyMixin {
}

@Component({
  directive: {},
  components: {},
  functionals: {},
  transitions: {},
  filters: {},
  name: 'my-component',
  delimiter: ['{{', '}}'],
})
class MyComponent extends VueTS.mix(MyMixin) {
  myData: string
  @Prop myProp: {nested: string}

  myMethod() {
  }

  get myGetter() {
    return this.myProp
  }

  @Watch<MyComponent>(function() {
    console.log(this.myData)
  })
  myWatchee: string

  // instance property reification
  $parent: MyMixin
  $refs: {
    mychild: VueTS
  }
  $el: HTMLElement

  $on() {}
  $off() {}
  $once() {}
  $emit() {}
  $nextTick() {}
  $mount() {}
  $destroy() {}

  // lifecycle
  beforeCreate() {}
  created() {}
  beforeDestroy() {}
  destroyed() {}
  beforeMount() {}
  mounted () {}
  beforeUpdate() {}
  updated () {}
  activated() {}
  deactivated() {}

  // extensibility, like vuex
  @Vuex myVuexGetter = getter(s => s.whatEver)
  @Vuex myAction = action(s => s.dispathc('myAction'))
}

var a = new MyComponent()
