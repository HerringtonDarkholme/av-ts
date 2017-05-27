import {MyComponent} from './spec'
import {expect} from 'chai'
import {
  Component, Data, Vue, Prop,
  Watch
} from '../index'


var globalCounter = 0

@Component({
  props: {
    b: String
  },
  watch: {
    a: () => {
      globalCounter++
    }
  }
})
class TestData extends Vue {
  @Prop({required: false}) a: number

  c =  456

  d = {
    e: {
      f: 123
    }
  }

  @Watch('c', {deep: true})
  increaseCounter() {
    globalCounter++
  }

  @Watch(['d', 'e', 'f'])
  decreaseCounter() {
    globalCounter--
  }

  @Data data() {
    return {
      c: this.a,
      d: {
        e: {
          f: 123
        }
      }
    }
  }
}

describe('various decorators', () => {
  it('should handle lifecycle', () => {
    let opt = MyComponent['options']
    expect(opt.created).to.be.an('array')
    expect(opt.methods['created']).to.be.a('function')

    let propsData = {
      numberWithoutDefault: 123,
      noDefaultInfersRequired: 456,
      forcedRequired: 789
    }

    let a = new MyComponent({ propsData })

    expect(a.lifecycleHooksCalled).to.equal(2)
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
    expect(opt.watch).to.haveOwnProperty('d.e.f')
    expect(opt.watch.c).to.haveOwnProperty('deep')
    expect(opt.watch.c.deep).to.equal(true)
  })

  it('should make watch run', done => {
    let instance = new TestData({
      propsData: {b: 'test', a: 123}
    })
    expect(globalCounter).to.equal(0)
    instance.c = 111
    instance.$nextTick(() => {
      expect(globalCounter).to.equal(1)
      instance.a = 321
      instance.$nextTick(() => {
        expect(globalCounter).to.equal(2)
        done()
      })
    })
  })

  it('should watch nested prop', done => {
    let instance = new TestData({
      propsData: {b: 'test', a: 123}
    })
    expect(globalCounter).to.equal(2)
    instance.d.e.f = 111
    instance.$nextTick(() => {
      expect(globalCounter).to.equal(1)
      done()
    })
  })

  it('should watch nested optional prop', () => {
    type Type = {
      prop?: number;
    }

    class Comp extends Vue {
      public member: Type;

      @Watch(['member', 'prop'])
      handler(newValue: number) {

      }
    }
    Comp
  })

})
