# Awesome Vue TS [![Build Status](https://travis-ci.org/HerringtonDarkholme/av-ts.svg?branch=master)](https://travis-ci.org/HerringtonDarkholme/av-ts)
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

1. component is declared via a decorated class. `extends` should work. (`mixin` support is added in 0.3.0!)

2. `data`, `methods` and `computed` can be declared by property initializer, member methods and property accessors in class body, respectively.

3. `props` are declared via `@Prop` decorator and property initializer.

4. `render` and life cycle handler like `created` is declared by decorated methods. They are declared in class body because these handlers use `this`. But you cannot invoke them on the instance itself. So they are decorated to remind users. When declaring custom methods, you should avoid these reserved names.

5. `watch` handlers are declared in `@Watch` decorator, so user cannot watch the wrong property.

6. All other options are considered as component's meta info. So users should declare them in the `@Component` decorator function.

7. You can also extend av-ts by `Component.register`ing new decorators. Useful for libraries like Vuex, Vue-router.


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

// Mixin them!
@Component
class App extends Mixin(VegetableSearchable, FruitSearchable) {}
```

Voila! No `implements`, No repeating code. And it looks like [real mixins in ES6](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/).

## install

Via our old friend npm.

`npm install av-ts --save`

And don't forget installing vue. and then in your vue file.

```typescript
import {Component} from 'av-ts'

@Component
class MyAwesomeComponent {
  // ....
}
```


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
  directive: {},
  components: {},
  functionals: {},
  filters: {},
  name: 'my-awesome-component',
  delimiter: ['{{', '}}'],
})
class MyComponent extends Vue {}
```

### `Trait`
-----

Type: `ClassDecorator | (option) => ClassDecorator`

An alias of `Component`,used for defining Vue traits to be mixed in.
At runtime, these decorators transform constructor to vue option and then feed to `Vue.extend`.
So there is no semantic difference between `Component` and `Trait`. Placing `Component` on a class to be used as mixin just feels too strange. This alias is solely for API aesthetic.

To use a `Trait`, declare a class that extends `Mixin(...Traits)`. See example in `Mixin` section.

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

By default, all undecorated instance properties are collected to `data` option. However, sometimes `data` function needs to access other instance properties like `props`, which is not availabel when you declare a Vue component class.

Here comes the `Data` decorator. When `Data` decorator is applied to a method, the method will be extracted as `data` function in vue's option, with `this` injected. And none instance property is counted as `data` option.

This is useful for [defining a local data property that uses the prop’s initial value as its initial value](http://vuejs.org/guide/components.html#One-Way-Data-Flow)

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

has roughly type: `(parentConstructor: typeof Vue, ...traitConstructor: (typeof Vue)[]): (typeof Vue)`

a function to mix all `Trait`s decorated constructors into one Vue constructor.

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


@Component class ApplePen extends Mixin(Apple, Pen) {
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

- [x] ~~`mixin`~~

- [x] ~~`extends`~~


