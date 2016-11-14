declare var Reflect: any

export function NOOP() {}

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
