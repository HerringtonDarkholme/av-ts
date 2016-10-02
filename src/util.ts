declare var Reflect: any

export function snapshot(obj: any) {
  if (obj == null || typeof obj !== 'object') {
    return obj
  }
  let temp: any = {}
  for (let key of Object.keys(obj)) {
    temp[key] = snapshot(obj[key])
  }
  return temp
}

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
