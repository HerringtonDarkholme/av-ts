import {MyComponent} from './spec'
import {expect} from 'chai'

describe('prop options', () => {
  let propsData: any = {
    numberWithoutDefault: 123,
    noDefaultInfersRequired: 456,
    forcedRequired: 789
  }

  it('should infer the correct type using reflection', () => {
    let prop = MyComponent['options'].props['numberWithoutDefault']
    expect(prop.type).to.equal(Number)
  })

  it('should infer required when no default value is given', () => {
    let prop = MyComponent['options'].props['noDefaultInfersRequired']
    expect(prop.default).to.be.undefined
    expect(prop.required).to.be.true
  })

  it('should infer not required when a default value is given', () => {
    let prop = MyComponent['options'].props['defaultInfersNotRequired']
    expect(prop.default).to.exist
    expect(prop.required).to.be.false
  })

  it('should infer not required when property is nullable', () => {
    let prop = MyComponent['options'].props['nullableSoNotRequired']
    expect(prop.default).to.be.null
    expect(prop.required).to.be.false
  })

  it('should infer correct type from default value', () => {
    let prop = MyComponent['options'].props['countIncrementedByFunctionDefaultProp']
    expect(prop.type).to.equal(Number)
  })

  it('should assign function type to props with function default values', () => {
    let prop = MyComponent['options'].props['functionType']
    expect(prop.default).to.be.a('function')
    expect(prop.type).to.equal(Function)
  })

  it('should only call the function in resultOf() when it needs the default value', () => {
    let a = new MyComponent({ propsData })

    expect(a.functionDefault).to.equal(0)
    expect(a.countIncrementedByFunctionDefaultProp).to.equal(1)

    propsData.functionDefault = 4

    let b = new MyComponent({ propsData })

    expect(b.functionDefault).to.equal(4)
    expect(b.countIncrementedByFunctionDefaultProp).to.equal(0)
  })

  it('should put an object default value in a function to return a different object for each instance', () => {
    let prop = MyComponent['options'].props['objectDefault']
    expect(prop.type).to.be.a('function')

    let a = new MyComponent({ propsData })
    let b = new MyComponent({ propsData })
    expect(a.objectDefault).to.not.equal(b.objectDefault)
  })

  it('should allow you to force a property to be required', () => {
    let prop = MyComponent['options'].props['forcedRequired']
    expect(prop.default).to.exist
    expect(prop.required).to.be.true
  })

  it('should allow you to force a property to not be required', () => {
    let prop = MyComponent['options'].props['forcedNotRequired']
    expect(prop.default).to.not.exist
    expect(prop.required).to.be.false
  })

  it('should allow you to overwrite the default using the decorator', () => {
    let prop = MyComponent['options'].props['defaultOverwritten']
    expect(prop.default).to.equal('overwritten')
  })

  it('should be able to work with multiple types using the decorator', () => {
    let prop = MyComponent['options'].props['multiTyped']
    expect(prop.type).to.have.members([String, Number])
  })
})
