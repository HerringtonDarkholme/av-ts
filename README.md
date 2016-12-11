# Awesome Vue TS [![Build Status](https://travis-ci.org/HerringtonDarkholme/av-ts.svg?branch=master)](https://travis-ci.org/HerringtonDarkholme/av-ts)
-----

![screenshot](https://raw.githubusercontent.com/HerringtonDarkholme/vue-ts-example/master/screen.png)

[Try av-ts in your browser](http://plnkr.co/edit/KHhs7KDye3kwUvM8SNyZ?p=preview)!

## Why:

Awesome Vue.TS aims at getting _type safety_ as much as possible, while still keeping TypeScript _concise_ and _idiomatic_.
To achieve this, av-ts exploits many techniques, tricks and hacks in TypeScript, which makes av-ts a good tour of TypeScript features.

**Note: The target vue version is 2.0.**

You can read more for av-ts' [raison d'etre here](http://herringtondarkholme.github.io/2016/11/01/how-to-choose-vue-library/)

## Quick start

1. [Try av-ts in your browser](http://plnkr.co/edit/KHhs7KDye3kwUvM8SNyZ?p=preview)!

2. use [template](https://github.com/HerringtonDarkholme/av-ts-template) by [vue-cli](https://github.com/vuejs/vue-cli)

```bash
npm install vue-cli -g
vue init HerringtonDarkholme/av-ts-template myproject
cd myproject
npm install
npm run dev
```


## Usage:

1. component is declared via a decorated class. `extends` should work. (`mixin` support is added in 0.3.0!)

2. `data`, `methods` and `computed` can be declared by property initializer, member methods and property accessors in class body, respectively.

3. `props` are declared via `@Prop` decorator and property initializer.

4. `render` and life cycle handler like `created` is declared by decorated methods. They are declared in class body because these handlers use `this`. But you cannot invoke them on the instance itself. So they are decorated to remind users. When declaring custom methods, you should avoid these reserved names.

5. `watch` handlers are declared by `@Watch(propName)` decorator, handler type is checked by `keyof` lookup type. Non-strict watches must use `@WatchSub(propPath)` decorator.

6. All other options are considered as component's meta info. So users should declare them in the `@Component` decorator function.

7. You can also extend av-ts by `Component.register`ing new decorators. Useful for libraries like Vuex, Vue-router.


## Example:

```typescript
import {
  Component, Prop, Watch, Lifecycle,
} from 'av-ts'

// vue options in `Component` decorator
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
  myWatchee = 'watch me!'
  @Watch('myWatchee')
  handler(newVal, oldVal) {
    console.log(this.myWatchee + 'changed!')
  })

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

## mixin examples

Contrary to other libraries, av-ts supports first class Mixin! Example adapted from [here](http://www.ie-kau.net/entry/2016/02/26/Vue.js%E3%81%AEmixin%E3%82%92%E5%88%A9%E7%94%A8%E3%81%97%E3%81%A6%E8%82%A5%E5%A4%A7%E5%8C%96%E3%81%97%E3%81%9FViewModel%E3%82%92%E3%83%AA%E3%83%95%E3%82%A1%E3%82%AF%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0%E3%81%99)

```typescript
// define mixin trait by `Trait` decorator
@Trait class VegetableSearchable extends Vue {
  vegetableName = 'tomato'
  searchVegetable() { alert('find vegi!')}
}

@Trait class FruitSearchable extends Vue {
  vegetableName = 'apple'
  searchVegetable() { alert('find fruits!')}
}

interface FGMixin extends VegetableSearchable, FruitSearchable {}

// Mixin them!
@Component
class App extends Mixin<FGMixin>(VegetableSearchable, FruitSearchable) {}
```

Voila! No `implements`, No repeating code. You only need to declare one more interface! And it looks like [real mixins in ES6](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/).

N.B.: actually declare one interface is TypeScript's limitation. But you can vote for removing this limitation [here](https://github.com/Microsoft/TypeScript/issues/10261).


## API

For full type signature, please refer to `av-ts.d.ts`. They are most up-to-date.


## Class Decorators
----

### `Component`
-----

Type: `ClassDecorator | (option) => ClassDecorator`

It can be directly applied on component class as decorator, or take one option argument and return a decorator function.

```typescript
@Component
class VueComp extends Vue {}

@Component({
  directives: {},
  components: {},
  filters: {},
  name: 'my-awesome-component',
  delimiters: ['{{', '}}'],
})
class MyComponent extends Vue {}
```

### `Trait`
-----

Type: `ClassDecorator | (option) => ClassDecorator`

An alias of `Component`,used for defining Vue traits to be mixed in.
At runtime, these decorators transform constructor to vue option and then feed to `Vue.extend`.
So there is no semantic difference between `Component` and `Trait`. Placing `Component` on a class to be used as mixin just feels too strange. This alias is solely for API aesthetic.

To use a `Trait`, declare a class that extends `Mixin<MixedInterface>(...Traits)`. See example in `Mixin` section.

## Property Decorators
----

### `Prop`
-----

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
-----

Same as vue-typescript, `@Watch` is applied to a **watched handler**.
`Watch` takes watchee name as the first argument, and an optional config object as the second one.


```typescript
// watch handler is declared by decorator
properyBeingWatched = 123
@Watch('properyBeingWatched', {deep: true})
handler(newVal, oldVal) {
  console.log('the delta is ' + (newVal - oldVal))
})
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

### `WatchSub`
-----

Same as `@Watch`, `@WatchSub` is applied to a **watched handler**.
`Watch` takes expression name as the first argument, and an optional config object as the second one.


```typescript
// watch handler is declared by decorator
properyBeingWatched = { key1: 0 }
@Watch('properyBeingWatched.key1', {deep: true})
handler(newVal, oldVal) {
  console.log('the delta is ' + (newVal - oldVal))
})
// ....
```

is equivalent to

```typescript
watch: {
  'properyBeingWatched.key1' {
    handler: function(newVal, oldVal) {
      console.log('the delta is ' + (newVal - oldVal))
    },
    deep: true
  }
}
```

### `Lifecycle` and `Render`
-----

Type: TypedPropertyDecorator

mark decorated methods as special hooks in vue. Caveat: You cannot call lifecycle/render in other methods.

```typescript
// lifecycle hook is speical so it is decorated
@Lifecycle mounted() {
  console.log('called in lifecycle code!')
}

// this decorator can only decorate method with name same as lifecycle
// @Lifecycle willNotCompile() {}
```

### `Transition`
-----

Type: TypedPropertyDecorator

mark method as a callback of transition component. method is still called in other instance methods.
This decorator is solely for type checking.

```typescript
// solely for type checking! beforeEnter can be called in other methods
@Transition beforeEnter(el: HTMLElement) {
  el.style.opacity = 0
  el.style.height = 0
}
```

### Data
-----

Type: TypedPropertyDecorator

Collecting instance properties is heavy and hacky. It needs to find all `props` and other properties for you. If you want to make instance creation faster you can skip `data` collection. Here comes the `Data` decorator. When `Data` decorator is applied to a method, the method will be extracted as `data` function in vue's option, with `this` injected. And none instance property is counted as `data` option.

Example:

```typescript
@Component
class TestData extends Vue {
  @Prop a = p(Number)
  b =  456 // this initializer will be ignored

  @Data data() {
    return {
      b: this.a // b will be initialized to prop value
    }
  }
}

let instance = new TestData({propsData: {a: 777}})
instance.b === 777 // true
```


## Utility Functions
---

### Mixin

has roughly type: `<V>(parentConstructor: typeof Vue, ...traitConstructor: (typeof Vue)[]): {new(): V}`

a function to mix all `Trait`s decorated constructors into one Vue constructor.

To use Mixin correctly, you need to declare one interface to extend all traits you need. Then pass it as a generic type argument to `Mixin<MixedInterface>(...traits)`. This is TypeScript's limitation.

It's return value is `parentConstructor.extend({mixins: traitConstructor})`: extending the first trait as parentConstructor and pack all remaining traits in `mixins` option.

See source for more specific type.


[Example](https://www.youtube.com/watch?v=PfHmMpWrCBA):

```typescript
@Trait class Pen extends Vue {
  havePen() { alert('I have a pen')}
}
@Trait class Apple extends Vue {
  haveApple() { alert('I have an apple')}
}

interface PAMixed extends Pen, Apple {}

@Component class ApplePen extends Mixin<PAMixed>(Apple, Pen) {
  Uh() {
    this.havePen()
    this.haveApple()
    alert('Apple pen')
  }
}
```

is equivalent to

```typescript
var Pen = Vue.extend({
  methods: {
    havePen() { alert('I have a pen')}
  }
})
var Apple = Vue.extend({
  methods: {
    haveApple() { alert('I have an apple')}
  }
})

var Mixin = Pen.extend({
  mixins: [ Apple ]
})

var ApplePen = Mixin.extend({
  methods: {
    Uh() {
      this.havePen()
      this.haveApple()
      alert('Apple pen')
    }
  }
})
```

Implementing `PineapplePen` and `PenPineappleApplePen` is left for exercise.


### Component.register
---

```typescript
// has type
Component.registter: (key: $$Prop, logic: DecoratorProcessor) => void
// $$Prop is a special string type that means you have to prefix the key with `$$`
// DecoratorProcessor can access prototype, instance and options of the decorated class
// where
type $$Prop = string & {'$$Prop Brand': never}
type DecoratorProcessor = (proto: Vue, instance: Vue, options: ComponentOptions<Vue>) => void;
```

`Component.register` is for advanced users.

Sometimes you need to extend Vue's functionality by adding new instance option. Those new options usually are not type-safe. For example, `render` is a special method can access `this` but cannot be put in `methods` option at the same time.

To implement a new decorator. You need first to know how av-ts works underhood. The [comment](https://github.com/HerringtonDarkholme/av-ts/blob/master/src/core.ts) is quite a good start. Also you can find some [example](https://github.com/HerringtonDarkholme/av-ts/blob/master/src/render.ts) [implmentation](https://github.com/HerringtonDarkholme/kilimanjaro/blob/master/src/decorator.ts#L16).



## common tricks
Please see [FAQ](https://github.com/HerringtonDarkholme/av-ts/wiki/FAQ)

Difference
---

**Added Feature:**

* new decorator `@Transition` for typechecking transition hooks!

**Todo Features:**

- [x] ~~`mixin`~~

- [x] ~~`extends`~~


