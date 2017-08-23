import {expect} from 'chai'
import {Trait, Component, Mixin, Vue} from '../index'

describe('util functions', () => {

  it('Trait should work like component', () => {
    expect(Trait).to.be.equal(Component)
  })

  it('should mixin', () => {
    @Trait class MA extends Vue {
      data1 = 123
      myMethod() {}
    }
    @Trait class MB extends Vue {
      data2 = 456
      myMethod2() {}
    }

    let Mixed = Mixin(MA, MB)
    expect(Mixed).to.be.a('function')
    let options = Mixed['options']
    expect(options).to.haveOwnProperty('mixins')
    expect(options.mixins).to.have.length(1)
    let instance = new Mixed
    expect(instance).to.haveOwnProperty('data1')
    expect(instance.data1).to.equal(123)
    expect(instance.data2).to.equal(456)
    expect(instance.myMethod).to.be.a('function')
    expect(instance.myMethod2).to.be.a('function')
  })

  it('should mixin instance', () => {
    @Trait class MA extends Vue {
      data1 = 123
      myMethod() {}
    }
    @Trait class MB extends Vue {
      data2 = 456
      myMethod2() {}
    }

    @Component
    class Mixed extends Mixin(MA, MB) {
      data3 = 222
      m() {
        this.myMethod()
      }
    }

    let instance = new Mixed

    expect(instance).to.haveOwnProperty('data1')
    expect(instance.data1).to.equal(123)
    expect(instance.data2).to.equal(456)
    expect(instance.myMethod).to.be.a('function')
    expect(instance.myMethod2).to.be.a('function')
  })

  it('more traits', () => {
    @Trait class A extends Vue {
      a = 1
    }
    @Trait class B extends Vue {
      b = 2
    }
    @Trait class C extends Vue {
      c = 3
    }
    @Trait class D extends Vue {
      d = 4
    }
    @Trait class E extends Vue {
      e = 5
    }

    interface M extends A, B, C, D, E {}

    @Component
    class Mixed extends Mixin<M>(A, B, C, D, E) {}
    let instance = new Mixed
    expect(instance.a).to.equal(1)
    expect(instance.b).to.equal(2)
    expect(instance.c).to.equal(3)
    expect(instance.d).to.equal(4)
    expect(instance.e).to.equal(5)

    @Component({
      components: {
        Mixed: Mixed
      }
    })
    class TestType extends Vue {}
    TestType
  })
})
