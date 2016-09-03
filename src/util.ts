export function snapshot(obj: any) {
  if (obj == null || typeof obj !== 'object') {
    return obj
  }
  let temp: any = {}
  for (let key in Object.keys(obj)) {
    temp[key] = snapshot(obj[key])
  }
  return temp
}

export function getReflectType(target: any, key: string): any {
    if (typeof Reflect === "object" && typeof Reflect.getMetadata === "function") {
      return Reflect.getMetadata('design:type', target, key)
    }
    return null
}
