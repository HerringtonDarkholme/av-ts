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
  @Prop complext = p({
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

* `mixin`

* `extends`


============================

Vuex API revamp:
----

Suppose we have one getter and on action

```javascript
function getInt(state) {
  return state.someInt
}

function increment(store) {
  store.dispatch('INCREMENT')
}
```

Original Vuex api highly relies on meta-programming.

```javascript
var comp = Vue({
  vuex: {
    getters: {
      getInt: getInt
    },
    actions: {
      increment: increment
    }
  }
})

comp.getInt // 123
comp.increment() // dispatched!
```

`comp` has two dynamically created field: `getInt` and `increment`. Even worse, these two fields have different signatures from their definition. `getInt: (state) => number`  whilst `comp.getInt: number`, `increment: (store) => void` whilst `comp.increment: Function`.

No easy way to acheive such type level surgery to Vue component.

It is confusing in using site that where the `store` parameter goes?

Alternative 1: Vuex Connect
----

**Design:**

Higher order component injects getters into wrapped component's props.

Wrapped component tells HOF to dispatch actions by emitting events.

```javascript

@Component({
  template: `
  <div>
    <p>{{ message }}</p>
    <input type="text" :value="message" @input="updateMessage">
  </div>
  `
})
class HelloComponent {
    @Prop message: string

    updateMessage(event) {
      this.$emit('update', event.target.value)
    }
}

connect({
  stateToProps: {
    message: state => state.message
  },

  methodsToEvents: {
    update: ({ commit }, value) => commit('UPDATE_INPUT', value)
  },
})('hello', HelloComponent)
```

**Review:**

* Reapeat myself twice.

* No type checking across component and connect.


Alternative 2: plain getter/method
------

**Design:**

Just declare plain old getter/method. Use `this.$store` directly.

```typescript
class Comp {
  get getInt() {
    return getInt(this.$store.state)
  }

  increment() {
    increment(this.$store)
  }
}
```

**Review:**

* No clearing cutting boundary between component and store.

* It violates Vuex design, why would one use it?

Alternative 3: Vuex mixin
----

**Design:**

Pack all vuex method into a mixin. Let component extend it.
To compute correct property types in mixin, actions/getters must have isomorphic signatures.
So Vuex method has `this` context set to `store`, rather than `component`

```typescript

// note that `this` in VuexRevamp's option is `$store`
var vuexMixin = VuexRevamp({
  get getInt() {
    return this.state.someInt
  },
  increment() {
    this.dispath('INCREMENT')
  }
})

class Comp extends Mixin(vuexMixin) {
  method() {
    // typechecks
    this.getInt
    this.increment()
  }
}
```

**Review:**

* Confusing `this` context.

* Two location to write logic.

* Promote writing getters/actions in components.

* Is it possible to merge two class with methods whose `this` are pointed to different objects? Not sure but it is bad.


Alternative 4: Vuex annotation + special transformer
-----

**Design:**

Annotate Vuex field like `Prop`, transform `getter/action` into simple `value/method`

```typescript
class Comp extends Vue {
  @Vuex
  getInt = getter(getInt) // actually getInt is a getter method

  @Vuex
  increment = action(increment)
}
```

**Review:**

* Implementation is dirty. Fooling typescript to believe `getter(getInt)` is a number while in fact it is not.

* Confusing for users to understand special transformer, especailly getter

* Repeat getter/action names.


Conclusion
-------

(Type) Safety, Brevity, Understandablity and Consistency are several conflicting factors in designing API.

I believe alternative 4 rewrites API in a type safe way.
It is relatively concise, only repeating two names.
Users may feel this API natural and easy, as long as they don't look inside its implementation detail.
Annotation + transformer follows Vuex design principle, and it even looks like the original API.



=============

Typed `Watch`
------

Short Answer: No

Long Answer:
According to [doc](https://www.typescriptlang.org/docs/handbook/decorators.html), a Property Descriptor is not provided to a property decorator because of no mechanism to describe an instance property when defining members of a prototype.

So we cannot get decorated property's type.

One may wonder that since `the return value of a property decorator will be used as the Property Descriptor`, the property type can be annotated as a generic in function signature and inferred by the compiler.

Sadly, the [spec](https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#4.23) says

* In the body of a function declaration, function expression, arrow function, method declaration, or get accessor declaration that has a return type annotation, return expressions are contextually typed by the type given in the return type annotation.

* In the body of a function expression or arrow function that has no return type annotation, if the function expression or arrow function is contextually typed by a function type with exactly one call signature, and if that call signature is **non-generic**, return expressions are contextually typed by the return type of that call signature.


Decorators have both return value and generic type. So inference is not possible for current compiler.

Anti-example:

```typescript
function ret<R extends string>(num: R): R {
  return 123 as any
}

function highorder(f: (a: any) => number) {
}

highorder(ret) // it compiles, while ideally it should not
```
