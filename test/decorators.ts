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
  c =  456

  @Data data() {
    return {
      c: this.a
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
    expect(opt.data.call({a: 123}).c).to.equal(123)
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
    expect(opt.watch).to.haveOwnProperty('c')
  })

  it('should handle various data initilization', () => {
    class Test {}
    var sharedObject = {}
    var counter = 0
    function cp(t: NumberConstructor): number {
      if (Component.inDefinition) {
        counter++
        return t as any
      }
      return undefined as any
    }
    @Component
    class TestComponent extends Vue {
      @Prop propValue = cp(Number)
      normal = 'normal'
      test = new Test
      own = this.propValue + 1
      shared = sharedObject
    }

    let instance = new TestComponent({
      propsData: {propValue: 123}
    })
    expect(instance.normal).to.equal('normal')
    expect(instance.test).to.be.instanceOf(Test)
    expect(instance.own).to.equal(124)
    expect(instance.shared).to.equal(sharedObject)
    expect(counter).to.equal(1)
  })

})
