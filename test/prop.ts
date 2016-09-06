import {MyComponent} from './spec'
import {expect} from 'chai'

describe('prop options', () => {
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
    expect(screwed).to.not.haveOwnProperty('defaultFunc')
    expect(screwed['defaultFunc']).to.equal(undefined)
  })

  it('should not set in data options', () => {
    let data = MyComponent.options.data!
    expect(data).to.not.have.property('myProp')
    expect(data).to.not.have.property('complex')
    expect(data).to.not.have.property('screwed')
  })
})
