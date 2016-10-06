import {expect} from 'chai'
import {Trait, functional, Component, p, Mixin, Vue} from '../index'

describe('util functions', () => {

  it('functional should change to vue compatible', () => {
    let c1 = functional(h => h('h1', 'hello world'))
    expect(c1).to.have.property('render')
    expect(c1.functional).to.be.true
    let c2 = functional(h => h(''), {myprop: p(Number)})
    expect(c2).to.haveOwnProperty('props')
    expect(c2.props).to.haveOwnProperty('myprop')
    expect(c2.props!['myprop']).to.deep.equal({type: Number})
  })

  it('Trait should work like component', () => {
    expect(Trait).to.be.equal(Component)
  })

  it('should mixin', () => {
    @Trait class A extends Vue {
      data1 = 123
      myMethod() {}
    }
    @Trait class B extends Vue {
      data2 = 456
      myMethod2() {}
    }

    let Mixed = Mixin(A, B)
    expect(Mixed).to.be.a('function')
    let options = Mixed['options']
    expect(options).to.haveOwnProperty('mixins')
    expect(options.mixins).to.have.length(2)
    let instance = new Mixed
    expect(instance).to.haveOwnProperty('data1')
    expect(instance.data1).to.equal(123)
    expect(instance.data2).to.equal(456)
    expect(instance.myMethod).to.be.a('function')
    expect(instance.myMethod2).to.be.a('function')
  })
})
