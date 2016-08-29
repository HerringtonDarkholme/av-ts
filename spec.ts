import {
  Component, Prop, Watch,
  Lifecycle
} from './index'

import {Vue} from './types/vue'

import {
  Vuex, getter, action
} from './vuex'

@Component({})
class MyMixin extends Vue {
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
class MyComponent extends Vue {
  myData: string
  @Prop() myProp: {nested: string}

  myMethod() {
  }

  get myGetter() {
    return this.myProp
  }

  @Watch<MyComponent>(function(){
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
  $state: any
  @Vuex
  get myVuexGetter() {
    return this.$state.whatever
  }
  @Vuex
  readonly getter2 = getter(s => s.whatever)

  @Vuex
  myAction() {
    this.$state.dispatch('myAction')
  }
  @Vuex
  readonly action2 = action(s => s.dispatch('action2'))
}

var a = new MyComponent()
