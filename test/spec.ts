import {
  Component, Prop, Watch,
  Lifecycle, p, Render, Vue
} from '../index'

// import 'reflect-metadata'


@Component
export class MyMixin extends Vue {
  public k: string
}

// extends interface option
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    vuex?: {}
  }
}

@Component({
  directives: {},
  components: {abc: {}},
  vuex: {},
  filters: {},
  name: 'my-component',
  transitions: {},
  delimiters: ['{{', '}}'],
})
export class MyComponent extends Vue {
  myData = '123'
  funcData = function() {
    console.log('ひふみ')
  }

  @Prop myProp = p(Function)

  @Prop complex = p({
    type: Object,
    required: true,
    default() {
      return {a: 123, b: 456}
    }
  })

  @Prop required = p({
    type: Number,
    required: true,
  })

  @Prop default = p({
    default() {
      return 123
    }
  })

  @Prop screwed = p({
    type: Function,
    // bug: TS cannot infer return type
    default(a: number) {
      return false
    }
  })

  myMethod() {
  }

  get myGetter() {
    return this.myProp
  }

  myWatchee = 'watch me!'

  @Watch('myWatchee')
  logWatch(str: string) {
    console.log(this.myData)
  }

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

  @Render render(h: Function) {
    return h('h1', 'Daisuke')
  }

}
