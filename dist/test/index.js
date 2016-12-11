"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var spec_1 = require("./spec");
var chai_1 = require("chai");
var index_1 = require("../index");
describe('vue component', function () {
    it('should return a vue constructor', function () {
        chai_1.expect(spec_1.MyComponent).to.haveOwnProperty('options');
        chai_1.expect(spec_1.MyComponent['options']).to.be.a('object');
    });
    it('should new to a vue instance', function () {
        var a = new spec_1.MyComponent({
            propsData: {
                complex: { test: 123 },
                required: 456,
            }
        });
        chai_1.expect(a).to.be.instanceOf(index_1.Vue);
    });
    it('should have data function in options', function () {
        var options = spec_1.MyComponent['options'];
        chai_1.expect(options).to.haveOwnProperty('data');
        chai_1.expect(options.data).to.be.a('function');
        var data = options.data();
        chai_1.expect(data).to.be.a('object');
        chai_1.expect(Object.keys(data)).to.be.eql(['myData', 'funcData', 'myWatchee']);
        chai_1.expect(data['myData']).to.equal('123');
        chai_1.expect(data['funcData']).to.be.a('function');
    });
    it('should have method in options', function () {
        var options = spec_1.MyComponent['options'];
        chai_1.expect(options).to.haveOwnProperty('methods');
        chai_1.expect(options.methods).to.have.ownProperty('myMethod');
        chai_1.expect(options.methods['myMethod']).to.be.a('function');
        chai_1.expect(Object.keys(options.methods)).to.be.eql(['myMethod', 'created']);
    });
    it('should not have function data in methods', function () {
        var options = spec_1.MyComponent['options'];
        chai_1.expect(options).to.haveOwnProperty('methods');
        chai_1.expect(options.methods).to.not.have.property('funcData');
    });
    it('should have computed in options', function () {
        var options = spec_1.MyComponent['options'];
        chai_1.expect(options).to.haveOwnProperty('computed');
        chai_1.expect(options.computed).to.haveOwnProperty('myGetter');
        var myGetter = options.computed['myGetter'];
        chai_1.expect(myGetter).to.be.a('object');
        chai_1.expect(myGetter).to.haveOwnProperty('get');
        chai_1.expect(myGetter.get).to.be.a('function');
    });
    it('should handle array in data', function () {
        var ArrayComp = (function (_super) {
            __extends(ArrayComp, _super);
            function ArrayComp() {
                var _this = _super.apply(this, arguments) || this;
                _this.myArray = [1, 2, 3];
                return _this;
            }
            return ArrayComp;
        }(index_1.Vue));
        ArrayComp = __decorate([
            index_1.Component,
            __metadata("design:paramtypes", [])
        ], ArrayComp);
        var options = ArrayComp['options'];
        chai_1.expect(options).to.haveOwnProperty('data');
        var data = options.data();
        chai_1.expect(data).to.haveOwnProperty('myArray');
        var myArray = data.myArray;
        chai_1.expect(myArray).to.be.a('array');
        chai_1.expect(myArray.push).to.be.a('function');
        chai_1.expect(myArray).to.have.length(3);
        chai_1.expect(myArray[0]).to.equal(1);
        chai_1.expect(myArray[1]).to.equal(2);
        chai_1.expect(myArray[2]).to.equal(3);
    });
    it('should only handle own property', function () {
        var sbmoz = Object.create({
            watch: function () { }
        });
        chai_1.expect(sbmoz).to.not.have.ownProperty('watch');
        chai_1.expect(sbmoz.watch).to.be.a('function');
        var Test = (function (_super) {
            __extends(Test, _super);
            function Test() {
                return _super.apply(this, arguments) || this;
            }
            return Test;
        }(index_1.Vue));
        Test = __decorate([
            index_1.Component(sbmoz),
            __metadata("design:paramtypes", [])
        ], Test);
        var options = Test['options'];
        chai_1.expect(options).to.haveOwnProperty('watch');
        chai_1.expect(options.watch).to.be.an('object');
    });
});
