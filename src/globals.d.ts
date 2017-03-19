declare interface Array<T> {
  diff(array: any[]): T[]
  mapToObject(transform: (obj: any) => any): any
}
