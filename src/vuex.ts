// TODO, sketch below is designed for Vuex1.0
export function Vuex(target: Object, key: string): void {
}

type VuexKeys = 'getter' | 'action'

type Getter<T> = (s: any) => T
export function getter<T>(g: Getter<T>): T {
  return {type: 'getter', value: g} as any
}

type Action = (s: any, ...args: any[]) => void
export function action<T>(a: Action): Function {
  return {type: 'action', value: a} as any
}
