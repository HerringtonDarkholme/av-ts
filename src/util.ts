import 'reflect-metadata'

export function NOOP() { }

export function getReflectType(target: Object, key: string): any {
  if (typeof Reflect === "object" && typeof Reflect.getMetadata === "function") {
    return Reflect.getMetadata('design:type', target, key)
  }
  return null
}

export interface Map<T> {
  [k: string]: T
}

export function createMap<T>(): Map<T> {
  const ret = Object.create(null)
  ret["__"] = undefined
  delete ret["__"]
  return ret
}

export function hasOwn(obj: Object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function objAssign<T, U, V>(target: T, source1: U, source2?: V): T & U & V {
  if (source1) {
    for (let n of Object.getOwnPropertyNames(source1)) {
      Object.defineProperty(target, n, Object.getOwnPropertyDescriptor(source1, n))
    }
  }
  if (source2) {
    for (let n of Object.getOwnPropertyNames(source2)) {
      Object.defineProperty(target, n, Object.getOwnPropertyDescriptor(source2, n))
    }
  }
  return <T & U & V>target
}

export const makeObject = (obj: any) => (key: string) => ({ [key]: obj[key] })

export module global {
  Array.prototype.diff =
    function <T>(this: T[], list: any[]): T[] {
      return this.filter(elem => list.indexOf(elem) === -1)
    }

  Array.prototype.mapToObject =
    function <T>(this: T[], transform: (obj: any) => any): any {
      let transformed: any = {}
      for (let elem of this) {
        objAssign(transformed, transform(elem))
      }
      return transformed
    }
}
