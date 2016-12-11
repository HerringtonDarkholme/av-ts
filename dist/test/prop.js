"use strict";
var spec_1 = require("./spec");
var chai_1 = require("chai");
describe('prop options', function () {
    it('should have prop suboptions in options', function () {
        var options = spec_1.MyComponent['options'];
        chai_1.expect(options).to.haveOwnProperty('props');
        var props = options.props;
        chai_1.expect(props).to.be.a('object');
        chai_1.expect(props).to.haveOwnProperty('myProp');
        chai_1.expect(props).to.haveOwnProperty('complex');
        chai_1.expect(props).to.haveOwnProperty('screwed');
    });
    it('should handle simple prop option', function () {
        var props = spec_1.MyComponent['options'].props;
        chai_1.expect(props['myProp']).to.deep.equal({ type: Function }, 'simple prop');
    });
    it('it should handle complex prop', function () {
        var props = spec_1.MyComponent['options'].props;
        var complex = props['complex'];
        chai_1.expect(complex['type']).to.equal(Object);
        chai_1.expect(complex['required']).to.equal(true);
        chai_1.expect(complex['default']).to.be.a('function');
        var defaultProp1 = complex['default']();
        chai_1.expect(defaultProp1).to.deep.equal({ a: 123, b: 456 });
        var defaultProp2 = complex['default']();
        chai_1.expect(defaultProp2).to.deep.equal({ a: 123, b: 456 }, 'idempotency');
        chai_1.expect(defaultProp1).to.not.equal(defaultProp2);
    });
    it('should handle prop for function', function () {
        var props = spec_1.MyComponent['options'].props;
        var screwed = props['screwed'];
        chai_1.expect(screwed['type']).to.equal(Function);
        chai_1.expect(screwed['default']).to.be.a('function');
        chai_1.expect(screwed).to.not.haveOwnProperty('defaultFunc');
        chai_1.expect(screwed['defaultFunc']).to.equal(undefined);
    });
    it('should not set in data options', function () {
        var data = spec_1.MyComponent['options'].data;
        chai_1.expect(data).to.not.have.property('myProp');
        chai_1.expect(data).to.not.have.property('complex');
        chai_1.expect(data).to.not.have.property('screwed');
    });
    it('should new instance', function () {
        var instance = new spec_1.MyComponent({
            propsData: {
                complex: { test: 123 },
                required: 456,
            }
        });
        chai_1.expect(instance.required).to.equal(456);
        chai_1.expect(instance.complex['test']).to.equal(123);
    });
});
