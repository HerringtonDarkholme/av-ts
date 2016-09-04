// functional isn't decorator, but worth implementing here
import Vue = require('vue')
import {RenderFunc, FunctionalProps} from './interface'

export function functional<T>(_props: T, render: RenderFunc<T>): FunctionalProps<T> {
  let props: any = _props
  return {
    props, render, functional: true
  }
}
