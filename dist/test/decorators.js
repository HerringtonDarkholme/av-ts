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
var globalCounter = 0;
var TestData = (function (_super) {
    __extends(TestData, _super);
    function TestData() {
        var _this = _super.apply(this, arguments) || this;
        _this.a = index_1.p(Number);
        _this.c = 456;
        _this.d = { a: 0, b: 0 };
        return _this;
    }
    TestData.prototype.increaseCounter = function () {
        globalCounter++;
    };
    TestData.prototype.increaseCounter2 = function () {
        globalCounter++;
    };
    TestData.prototype.data = function () {
        return {
            c: this.a,
            d: {
                a: 1,
                b: 2,
            }
        };
    };
    return TestData;
}(index_1.Vue));
__decorate([
    index_1.Prop,
    __metadata("design:type", Object)
], TestData.prototype, "a", void 0);
__decorate([
    index_1.Watch('c', { deep: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestData.prototype, "increaseCounter", null);
__decorate([
    index_1.WatchSub('d.a', { deep: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestData.prototype, "increaseCounter2", null);
__decorate([
    index_1.Data,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestData.prototype, "data", null);
TestData = __decorate([
    index_1.Component({
        props: {
            b: String
        },
        watch: {
            a: function () {
                globalCounter++;
            }
        }
    }),
    __metadata("design:paramtypes", [])
], TestData);
describe('various decorators', function () {
    it('should handle lifecycle', function () {
        var opt = spec_1.MyComponent['options'];
        chai_1.expect(opt.beforeCreate).to.be.a('array');
        chai_1.expect(opt).to.not.have.property('created');
        chai_1.expect(opt.methods['created']).to.be.a('function');
    });
    it('should handle render', function () {
        var opt = spec_1.MyComponent['options'];
        chai_1.expect(opt).to.have.ownProperty('render');
        chai_1.expect(opt.render).to.be.a('function');
    });
    it('should handle watch', function () {
        var opt = spec_1.MyComponent['options'];
        chai_1.expect(opt.watch).to.have.ownProperty('myWatchee');
    });
    it('should use @Data', function () {
        var opt = TestData['options'];
        chai_1.expect(opt).to.have.property('data');
        chai_1.expect(opt.data).to.be.a('function');
        chai_1.expect(opt.data.call({ a: 123 }).c).to.equal(123);
        chai_1.expect(opt.methods.data).to.equal(undefined);
        var instance = new TestData({ propsData: { a: 777 } });
        chai_1.expect(instance).to.have.property('a');
        chai_1.expect(instance.a).to.be.equal(777);
        chai_1.expect(instance.data).to.equal(undefined);
    });
    it('should merge options', function () {
        var opt = TestData['options'];
        chai_1.expect(opt).to.have.property('props');
        chai_1.expect(opt.props).to.haveOwnProperty('a');
        chai_1.expect(opt.props).to.haveOwnProperty('b');
    });
    it('should merge watch', function () {
        var opt = TestData['options'];
        chai_1.expect(opt).to.have.property('watch');
        chai_1.expect(opt.watch).to.haveOwnProperty('a');
        chai_1.expect(opt.watch).to.haveOwnProperty('c');
        chai_1.expect(opt.watch.c).to.haveOwnProperty('deep');
        chai_1.expect(opt.watch.c.deep).to.equal(true);
        chai_1.expect(opt.watch).to.haveOwnProperty('d.a');
        chai_1.expect(opt.watch['d.a']).to.haveOwnProperty('deep');
        chai_1.expect(opt.watch['d.a'].deep).to.equal(true);
    });
    it('should handle various data initilization', function () {
        var Test = (function () {
            function Test() {
            }
            return Test;
        }());
        var sharedObject = {};
        var counter = 0;
        function cp(t) {
            if (index_1.Component.inDefinition) {
                counter++;
                return t;
            }
            return undefined;
        }
        var TestComponent = (function (_super) {
            __extends(TestComponent, _super);
            function TestComponent() {
                var _this = _super.apply(this, arguments) || this;
                _this.propValue = cp(Number);
                _this.normal = 'normal';
                _this.test = new Test;
                _this.own = _this.propValue + 1;
                _this.shared = sharedObject;
                return _this;
            }
            return TestComponent;
        }(index_1.Vue));
        __decorate([
            index_1.Prop,
            __metadata("design:type", Object)
        ], TestComponent.prototype, "propValue", void 0);
        TestComponent = __decorate([
            index_1.Component,
            __metadata("design:paramtypes", [])
        ], TestComponent);
        var instance = new TestComponent({
            propsData: { propValue: 123 }
        });
        chai_1.expect(instance.normal).to.equal('normal');
        chai_1.expect(instance.test).to.be.instanceOf(Test);
        chai_1.expect(instance.own).to.equal(124);
        chai_1.expect(instance.shared).to.equal(sharedObject);
        chai_1.expect(counter).to.equal(1);
    });
    it('should make watch run', function (done) {
        var instance = new TestData({
            propsData: { b: 'test', a: 123 }
        });
        chai_1.expect(globalCounter).to.equal(0);
        var testModifications = [
            { handle: function () { instance.c = 111; }, inc: true },
            { handle: function () { instance.a = 321; }, inc: true },
            { handle: function () { instance.d.a++; }, inc: true },
            { handle: function () { instance.d.a = { x: 0 }; }, inc: true },
            { handle: function () { instance.d.a.x++; }, inc: true },
        ];
        function test(currentTest, currentGlobalCouter) {
            if (currentTest == testModifications.length) {
                done();
            }
            else {
                testModifications[currentTest].handle();
                if (testModifications[currentTest].inc)
                    currentGlobalCouter++;
                instance.$nextTick(function () {
                    chai_1.expect(globalCounter).to.equal(currentGlobalCouter);
                    test(currentTest + 1, currentGlobalCouter);
                });
            }
        }
        ;
        test(0, 0);
    });
});
