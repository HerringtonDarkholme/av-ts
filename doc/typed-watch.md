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
