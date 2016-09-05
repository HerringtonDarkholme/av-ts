Awesome Vue.TS
-----

Example:

```typescript
@Component({
  filters: {},
  name: 'my-component',
  delimiter: ['{{', '}}'],
})
export class MyComponent extends Vue {
  // instance variable is `data`
  myData = '123'

  // props declaration
  @Prop myProp = p(Function)
  @Prop complex = p({
    type: Object,
    required: true,
    default() {
      return {a: 123, b: 456}
    }
  })

  myMethod() {
    console.log('myMethod called!')
  }

  get myGetter() {
    return this.myProp
  }

  // watch handler is declared by decorator
  @Watch(function(){
    console.log(this.myData + 'changed!')
  })
  myWatchee: string

  // instance property reification
  $refs: {
    mychild: Vue
  }
  $el: HTMLDivElement

  // lifecycle
  @Lifecycle beforeCreate() {}
}
```


Difference
---

**Added Feature:**

* functional component has its own assets slot.

* new decorator `@Transition` for typechecking transition hooks!

**Removed Feature:**

* transitions is no longer needed given `<transition>` wrapper component.

**Todo Features:**

- [ ] `mixin`

- [x] `extends`
