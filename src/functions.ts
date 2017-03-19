// functional isn't decorator, but worth implementing here
import { VClass } from './interface'
import Vue from 'vue'

export function Mix<T extends Vue>(parent: typeof Vue, ...mixins: (typeof Vue)[]): VClass<T> {
  return parent.extend({ mixins }) as any
}
