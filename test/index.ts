import {MyComponent} from './spec'
import {expect} from 'chai'

import Vue = require('vue')

describe('vue component', () => {

  it('should return a vue constructor', () => {
    expect(MyComponent).to.haveOwnProperty('options')
    expect(MyComponent['options']).to.be.a('object')
  })

  it('should new to a vue instance', () => {
    let a = new MyComponent
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

})

