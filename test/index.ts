import {MyComponent} from './spec'
import {expect} from 'chai'
import {Component, Vue} from '../index'

describe('vue component', () => {

  it('should return a vue constructor', () => {
    expect(MyComponent).to.haveOwnProperty('options')
    expect(MyComponent['options']).to.be.a('object')
  })

  it('should new to a vue instance', () => {
    let a = new MyComponent({
      propsData: {
        complex: {test: 123},
        required: 456,
      }
    })
    expect(a).to.be.instanceOf(Vue)
  })

  it('should have data function in options', () => {
    let options = MyComponent['options']
    expect(options).to.haveOwnProperty('data')
    expect(options.data).to.be.a('function')
    let data = (options.data as any)()
    expect(data).to.be.a('object')
    expect(Object.keys(data)).to.be.eql(['myData', 'funcData', 'myWatchee'])
    expect(data['myData']).to.equal('123')
    expect(data['funcData']).to.be.a('function')
  })


  it('should have method in options', () => {
    let options = MyComponent['options']
    expect(options).to.haveOwnProperty('methods')
    expect(options.methods).to.have.ownProperty('myMethod')
    expect(options.methods!['myMethod']).to.be.a('function')
    expect(Object.keys(options.methods)).to.be.eql(['myMethod', 'created'])
  })

  it('should not have function data in methods', () => {
    let options = MyComponent['options']
    expect(options).to.haveOwnProperty('methods')
    expect(options.methods).to.not.have.property('funcData')
  })

  it('should have computed in options', () => {
    let options = MyComponent['options']
    expect(options).to.haveOwnProperty('computed')
    expect(options.computed).to.haveOwnProperty('myGetter')
    let myGetter = options.computed!['myGetter']
    expect(myGetter).to.be.a('object')
    expect(myGetter).to.haveOwnProperty('get')
    expect(myGetter.get).to.be.a('function')
  })

  it('should handle array in data', () => {
    @Component
    class ArrayComp extends Vue {
      myArray = [1, 2, 3]
    }
    let options = ArrayComp['options']
    expect(options).to.haveOwnProperty('data')
    let data = options.data()
    expect(data).to.haveOwnProperty('myArray')
    let myArray = data.myArray
    expect(myArray).to.be.a('array')
    expect(myArray.push).to.be.a('function')
    expect(myArray).to.have.length(3)
    expect(myArray[0]).to.equal(1)
    expect(myArray[1]).to.equal(2)
    expect(myArray[2]).to.equal(3)

  })

  it('should only handle own property', () => {
    const sbmoz: any = Object.create({
      watch() {}
    })
    expect(sbmoz).to.not.have.ownProperty('watch')
    expect(sbmoz.watch).to.be.a('function')

    @Component(sbmoz)
    class Test extends Vue {}

    const options = Test['options']
    expect(options).to.haveOwnProperty('watch')
    expect(options.watch).to.be.an('object')

  })

  it('should support static property', () => {
    @Component
    class A extends Vue {
      static field = 123
      static method() {
        return 456
      }
      method() {
        return A.method() + A.field
      }
    }
    expect(A.field).to.equal(123)
    expect(A.method()).to.equal(456)
    const instance = new A()
    expect(instance.method()).to.equal(579)
  })

})

