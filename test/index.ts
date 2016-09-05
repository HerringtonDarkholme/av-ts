import {MyComponent} from './spec'
import {expect} from 'chai'

import Vue = require('vue')

describe('vue component', () => {
  it('should return vue instance', () => {
    let a = new MyComponent
    expect(a).to.be.instanceOf(Vue)
  })
})

