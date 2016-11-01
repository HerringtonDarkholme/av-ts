import {MyComponent} from './spec'
import {expect} from 'chai'
import {
  Component, Data, Vue, Prop, p,
  Watch
} from '../index'

@Component({
  props: {
    b: String
  },
  watch: {
    a: () => {}
  }
})
class TestData extends Vue {
  @Prop a = p(Number)

  @Watch(() => {})
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
    expect(opt.methods.data).to.equal(undefined)
    let instance = new TestData({propsData: {a: 777}})
    expect(instance).to.have.property('a')
    expect(instance.a).to.be.equal(777)
    expect(instance.data).to.equal(undefined)
  })

  it('should merge options', () => {
    let opt = TestData['options']
    expect(opt).to.have.property('props')
    expect(opt.props).to.haveOwnProperty('a')
    expect(opt.props).to.haveOwnProperty('b')
  })

  it('should merge watch', () => {
    let opt = TestData['options']
    expect(opt).to.have.property('watch')
    expect(opt.watch).to.haveOwnProperty('a')
    expect(opt.watch).to.haveOwnProperty('b')
  })
})
