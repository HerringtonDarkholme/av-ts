import { expect } from 'chai'
import { Trait, Component, Mix, Vue } from '../index'

describe('util functions', () => {

  it('Trait should work like component', () => {
    expect(Trait).to.be.equal(Component)
  })

  it('should mixin', () => {
    @Trait class MA extends Vue {
      data1 = 123
      myMethod() { }
    }
    @Trait class MB extends Vue {
      data2 = 456
      myMethod2() { }
    }
    interface Mixed extends MA, MB { }

    let Mixed = Mix<Mixed>(MA, MB)
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
      myMethod() { }
    }
    @Trait class MB extends Vue {
      data2 = 456
      myMethod2() { }
    }

    interface M extends MA, MB { }

    @Component
    class Mixed extends Mix<M>(MA, MB) {
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
})
