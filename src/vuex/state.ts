export class State {
  /** @internal */ avtsModuleState = {}

  private constructor(s: any) {
    for (let key of Object.keys(s)) {
      this[key] = s[key]
    }
  }

  $(key: string): any {
    return this.avtsModuleState[key]
  }

  static create<S>(s: S): S & State {
    return new State(s) as any
  }
}
