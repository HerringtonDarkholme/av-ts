import {MyComponent} from './spec'
import {expect} from 'chai'

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
})
