[DEPRECATED] Vuex API revamp:
----

> This doc is for Vuex1.0. But the idea is used in `Prop`

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
