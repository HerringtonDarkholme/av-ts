declare class Store<S> {}

type StateFuncs<S> = {[k: string]: ((this: S, ...args: any[]) => any)}
type StoreFuncs<S, G, M, A> = {
  [k: string]: (this: VStore<S, G, M, A>, ...args: any[]) => any
}
type VStore<S, G, M, A> = {
  state: S
  getters: G
  mutations: M
  actions: A
}

interface Full<S, G, M, A> {
  module<S_, G_, M_, A_>(name: string, m: Full<S_, G_, M_, A_>): Full<S, G_&G, M_&M, A_&A>
  subState<Sub>(sub: Sub): Full<Sub&S, G, M, A>
  state<S_>(s: S_): Full<S_&S, G, M, A>
  getters<G_>(g: G_): Full<S, G_&G, M, A>
  mutations<M_ extends StateFuncs<S>>(m: M_): Full<S, G, M_&M, A>
  actions<A_ extends StoreFuncs<S, G, M, A>>(a: A_): Full<S, G, M, A_&A>
  toComponentHelper(): VStore<S, G, M, A>
  toStore(): Store<S>
  toConfig: any
  stateType: S
}

declare function create(): Full<{}, {}, {}, {}>

var subModule = create()
.state({
  myState: 123,
  initial: 'string',
  customer: {
    name: 'kvm',
    age: 18
  }
})

var trueSub = subModule
.getters({
  get customerName(this: typeof subModule.stateType) {
    return this.customer.name
  },
  get prefixedName(this: typeof subModule.stateType) {
    return this.initial + ' ' + this.customer.name
  }
})
.mutations({
  kkk() {
    this.initial
  }
})

create()
  .module('subModule', trueSub)
  .subState({
    subModule: trueSub.stateType
  })
  .state({
    make: 123
  })
  .actions({
    yearPass() {
    }
  })
