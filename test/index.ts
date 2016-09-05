import {MyComponent} from './spec'
import {expect} from 'chai'

import Vue = require('vue')

describe('vue component', () => {

  it('should return a vue constructor', () => {
    expect(MyComponent).to.haveOwnProperty('options')
    expect(MyComponent.options).to.be.a('object')
  })

  it('should new to a vue instance', () => {
    let a = new MyComponent
    expect(a).to.be.instanceOf(Vue)
  })

  it('should have data function in options', () => {
    let options = MyComponent.options
    expect(options).to.haveOwnProperty('data')
    expect(options.data).to.be.a('function')
    let data = (options.data as any)()
    expect(data).to.be.a('object')
    expect(data).to.deep.equal({myData: '123'})
  })

  it('should have prop suboptions in options', () => {
    let options = MyComponent.options
    expect(options).to.haveOwnProperty('props')
    let props = options.props!
    expect(props).to.be.a('object')
    expect(props).to.haveOwnProperty('myProp')
    expect(props).to.haveOwnProperty('complex')
    expect(props).to.haveOwnProperty('screwed')
  })

  it('should handle simple prop option', () => {
    let props = MyComponent.options.props!
    expect(props['myProp']).to.deep.equal({type: Function}, 'simple prop')
  })

  it('it should handle complex prop', () => {
    let props: any = MyComponent.options.props
    let complex = props['complex']
    expect(complex['type']).to.equal(Object)
    expect(complex['required']).to.equal(true)
    expect(complex['default']).to.be.a('function')
    let defaultProp1 = complex['default']()
    expect(defaultProp1).to.deep.equal({a: 123, b: 456})
    let defaultProp2 = complex['default']()
    expect(defaultProp2).to.deep.equal({a: 123, b: 456}, 'idempotency')
    expect(defaultProp1).to.not.equal(defaultProp2)
  })

  it('should handle prop for function', () => {
    let props: any = MyComponent.options.props
    let screwed = props['screwed']
    expect(screwed['type']).to.equal(Function)
    expect(screwed['default']).to.be.a('function')
    expect(screwed['defaultFunc']).to.equal(undefined)
  })

})

