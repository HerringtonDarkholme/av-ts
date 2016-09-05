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

  it('should handle propOption declaration', () => {
    let props = MyComponent.options.props!
    expect(props['myProp']).to.deep.equal({type: Function}, 'simple prop')
  })

  it('for complex prop', () => {
    let props: any = MyComponent.options.props
    let complex = props['complex']
    expect(complex['type']).to.equal(Object)
    expect(complex['required']).to.equal(true)
    expect(complex['default']).to.be.a('function')
    let defaultProp = complex['default']()
    expect(defaultProp).to.deep.equal({a: 123, b: 456})
    defaultProp = complex['default']()
    expect(defaultProp).to.deep.equal({a: 123, b: 456}, 'idempotency')
  })

})

