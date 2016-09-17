export interface Subscriber<P, S> {
  (mutation: P, state: S): void
}

export interface RawGetter<S, R> {
  (s: S): R
}

export interface CommitOption {
  silent?: boolean
}
