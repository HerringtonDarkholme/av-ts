export function Vuex(target: Object, key: string) {
}

type Getter<T> = (s: any) => T
export function getter<T>(g: Getter<T>): T {
  return null as any
}

type Action = (s: any, ...args: any[]) => void
export function action<T>(a: Action): Function {
  return null as any
}
