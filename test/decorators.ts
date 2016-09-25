import {MyComponent} from './spec'
import {expect} from 'chai'
import {
  Component, Data, Vue, Prop, p
} from '../index'

@Component
class TestData extends Vue {
  @Prop a = p(Number)
  b =  456

  @Data data() {
    return {
      b: this.a
    }
  }
}

describe('various decorators', () => {
  it('should handle lifecycle', () => {
    let opt = MyComponent['options']
    expect(opt.beforeCreate).to.be.a('array')
    expect(opt).to.not.have.property('created')
    expect(opt.methods!['created']).to.be.a('function')
  })

  it('should handle render', () => {
    let opt = MyComponent['options']
    expect(opt).to.have.ownProperty('render')
    expect(opt.render).to.be.a('function')
  })

  it('should handle watch', () => {
     let opt = MyComponent['options']
     expect(opt.watch).to.have.ownProperty('myWatchee')
  })

  it('should use @Data', () => {
    let opt = TestData['options']
    expect(opt).to.have.property('data')
    expect(opt.data).to.be.a('function')
    expect(opt.data.call({a: 123}).b).to.equal(123)
    let instance = new TestData({propsData: {a: 777}})
    expect(instance).to.have.property('a')
    expect(instance.a).to.be.equal(777)
  })
})
