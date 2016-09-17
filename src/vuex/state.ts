export class State {
  /** @internal */ avtsModuleState = {}

  constructor(s: any) {
    for (let key of Object.keys(s)) {
      this[key] = s[key]
    }
  }

  $(key: string): any {
    return this.avtsModuleState[key]
  }
}

export function getSubState(root: State, paths: string[]) {
  let state = root
  for (let path of paths) {
    if (!state) break
    state = state.$(path)
  }
  return state
}
