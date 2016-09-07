Awesome Vue TS
-----

## Why:

Awesome Vue.TS aims at getting type safety as much as possible, while still keeping TypeScript concise and idiomatic.
To achieve this, av-ts exploits many techniques, tricks and hacks in TypeScript, which makes av-ts a good tour of TypeScript features.

Note: The target vue version is 2.0.

The canonical [library](https://github.com/vuejs/vue-class-component) does not
solve the problem that `this.propertyInDataOption` is not checked by compiler.

Another popular [library](https://github.com/itsFrank/vue-typescript) can provide more
decorators for different usages and more type-safety.

None of the above two has taken extensibility into account.
While av-ts pays attention how users can create their own decorators.

I believe av-ts have a good balance between safety, brevity, consistency and extensibility.

## Usage:

1. component is declared via a decorated class. `extends` should work. (`mixin` support is under consideration)

2. `data`, `methods` and `computed` can be declared by property initializer, member methods and property accessors in class body, respectively.

3. `props` are declared via `@Prop` decorator and property initializer.

4. `render` and life cycle handler like `created` is declared by decorated methods. They are declared in class body because these handlers use `this`. But you cannot invoke them on the instance itself. So they are decorated to remind users. When declaring custom methods, you should avoid these reserved names.

5. `watch` handlers are declared in `@Watch` decorator, so user cannot watch the wrong property.

6. All other options are considered as component's meta info. So users should declare them in the `@Componet` decorator function.


## Example:

```typescript
import {
  Component, Prop, Watch, Lifecycle,
} from 'av-ts'

// meta info in `Component` decorator
@Component({
  filters: {},
  name: 'my-component',
  delimiter: ['{{', '}}'],
})
export class MyComponent extends Vue { // extends Vue or your own component
  // instance variable is in `data`
  myData = '123'

  // props declaration
  @Prop myProp = p({
    type: Object,
    required: true,
    default() {
      return {a: 123, b: 456}
    }
  })

  // method is `method`
  myMethod() {
    console.log('myMethod called!')
  }

  // accessor is `computed`
  get myGetter() {
    return this.myProp
  }

  // watch handler is declared by decorator
  @Watch(function(){
    console.log(this.myWatchee + 'changed!')
  })
  myWatchee = 'watch me!'

  // lifecycle hook is speical so it is decorated
  @Lifecycle beforeCreate() {}
}
```

which is equivalent to

```typescript

let MyComponent = Vue.extend({
  filters: {},
  name: 'my-component',
  delimiter: ['{{', '}}'],
  data() {
    return {
      myData: '123',
      myWatchee: 'watch me!'
    }
  },
  props: {
    myProp: {
      type: Object,
      required: true,
      default() {
        return {a: 123, b: 456}
      }
    }
  },
  methods: {
    myMethod() {
      console.log('my method called!')
    }
  },
  computed: {
    myGetter: {
      get() {
        return this.myProp
      }
    }
  },
  watch: {
    myWatchee() {
      console.log(this.myWatchee + 'changed!')
    }
  },
  beforeCreate() {}
})
```

## install

Via our old friend npm.

`npm install av-ts --save`

And don't forget installing vue. and then in your vue file.

```typescript
import {Componet} from 'av-ts'

@Componet
class MyAwesomeComponent {
  // ....
}
```


## API

For full type signature, please refer to `av-ts.d.ts`. They are most up-to-date.

### `Component`

Type: `ClassDecorator | (option) => ClassDecorator`

It can be directly applied on component class as decorator, or take one option argument and return a decorator function.

```typescript
@Component
class VueComp extends Vue {}

@Componet({
  directive: {},
  components: {},
  functionals: {},
  filters: {},
  name: 'my-awesome-component',
  delimiter: ['{{', '}}'],
})
class MyComponent extends Vue {}
```

### `Prop`

Type: `PropertyDecorator`

Decorated properties should be the return value of utility function `p`. `p` is a function takes property option and return a fake type placeholder that will specify the property type. The fake type placeholder, at runtime, is just the config option object you feed to the argument.

```typescript
@Prop
myProp = p({
  type: Number,
  default: 123
})

// p(option) returns a `number` type placeholder
// so the following code compiles
var num: number = p({
  type: Number
})

// will print {type: Number}
console.log(num)

// you can also use a shorthand form of `p`
@Prop shortHand = p(String)
```

### `Watch`

Contrary to vue-typescript, `@Watch` is applied to a **watched property**.
`Watch` takes handler as the first argument, and an optional config object as the second one.


```typescript
// ....

@Watch(function(newVal, oldVal) {
  console.log('the delta is ' + (newVal - oldVal))
}, {deep: true})
properyBeingWatched: number

// ....
```

is equivalent to

```typescript
watch: {
  properyBeingWatched: {
    handler: function(newVal, oldVal) {
      console.log('the delta is ' + (newVal - oldVal))
    },
    deep: true
  }
}
```

### `Lifecycle` and `Render`

Type: TypedPropertyDecorator

mark decorated methods as special hooks in vue. You cannot call them in methods.

### `Transition`

Type: TypedPropertyDecorator

mark method as a callback of transition component. method is still called in other instance methods.
This decorator is solely for type checking.

## common tricks
One can specify more specific class in vue special fields like `$el`. This can be done by annotating types on a class property declaration without initializer.

```typescript
class MyComponent extends Vue {
  // instance property reification
  $refs: {
    mychild: Vue
  }
  // don't initialize `$el`
  $el: HTMLDivElement
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

- [x] ~~`extends`~~


