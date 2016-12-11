import {MyComponent} from './spec'
import {expect} from 'chai'
import {
  Component, Data, Vue, Prop, p,
  Watch, WatchSub
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
  @Prop a = p(Number)

  c =  456

  d : {a: any, b: number} = {a: 0, b: 0};

  @Watch('c', {deep: true})
  increaseCounter() {
    globalCounter++
  }

  @WatchSub('d.a', {deep: true})
  increaseCounter2() {
    globalCounter++
  }

  @Data data() {
    return {
      c: this.a,
      d: {
        a: 1,
        b: 2,
      }
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
    expect(opt.watch.c).to.haveOwnProperty('deep')
    expect(opt.watch.c.deep).to.equal(true)

    expect(opt.watch).to.haveOwnProperty('d.a')
    expect(opt.watch['d.a']).to.haveOwnProperty('deep')
    expect(opt.watch['d.a'].deep).to.equal(true)
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

  it('should make watch run', done => {
    let instance = new TestData({
      propsData: {b: 'test', a: 123}
    })
    expect(globalCounter).to.equal(0)

    const testModifications = [
      { handle: () => {instance.c = 111}, inc: true },
      { handle: () => {instance.a = 321}, inc: true },
      { handle: () => {instance.d.a++}, inc: true },
      { handle: () => {instance.d.a = {x: 0}}, inc: true },
      { handle: () => {instance.d.a.x++}, inc: true },
    ];

    function test(currentTest: number, currentGlobalCouter: number){
      if (currentTest == testModifications.length) {
        done();
      } else {
        testModifications[currentTest].handle();
        if(testModifications[currentTest].inc) currentGlobalCouter++;
        instance.$nextTick(() => {
          expect(globalCounter).to.equal(currentGlobalCouter);
          test(currentTest+1, currentGlobalCouter);
        });
      }
    };

    test(0,0);
  })
})
