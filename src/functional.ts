// functional isn't decorator, but worth implementing here
import {RenderFunc, FunctionalProps} from './interface'

export function functional<T>(render: RenderFunc<T>, _props: T): FunctionalProps<T> {
  // we fool compiler here. _props at runtime is a config object in Vue
  // but for better type inference we `assert` it as a plain data object
  // for more info please refer to the helper function `p` in prop.ts
  let props: any = _props
  return {
    props, render, functional: true
  }
}
