type WatchHandler<C, T> = (this: C, newVal?: any, oldVal?: any) => void

interface WatchOption {
  deep?: boolean
  immediate?: boolean
}

export function Watch<C, T>(func: WatchHandler<C, T>, option: WatchOption = {}): PropertyDecorator {
  return null as any
}
