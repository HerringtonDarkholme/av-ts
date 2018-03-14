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

export function hasOwn(obj: Object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

// builtin TypedPropertyDescriptor assumes `set`
// which causes variance check error
// skip `set` since we don't use it
export interface ReadonlyPropertyDescriptor<T> {
    enumerable?: boolean;
    configurable?: boolean;
    writable?: boolean;
    value?: T;
    get?: () => T;
}
