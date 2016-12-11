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
var chai_1 = require("chai");
var index_1 = require("../index");
describe('util functions', function () {
    it('Trait should work like component', function () {
        chai_1.expect(index_1.Trait).to.be.equal(index_1.Component);
    });
    it('should mixin', function () {
        var MA = (function (_super) {
            __extends(MA, _super);
            function MA() {
                var _this = _super.apply(this, arguments) || this;
                _this.data1 = 123;
                return _this;
            }
            MA.prototype.myMethod = function () { };
            return MA;
        }(index_1.Vue));
        MA = __decorate([
            index_1.Trait,
            __metadata("design:paramtypes", [])
        ], MA);
        var MB = (function (_super) {
            __extends(MB, _super);
            function MB() {
                var _this = _super.apply(this, arguments) || this;
                _this.data2 = 456;
                return _this;
            }
            MB.prototype.myMethod2 = function () { };
            return MB;
        }(index_1.Vue));
        MB = __decorate([
            index_1.Trait,
            __metadata("design:paramtypes", [])
        ], MB);
        var Mixed = index_1.Mixin(MA, MB);
        chai_1.expect(Mixed).to.be.a('function');
        var options = Mixed['options'];
        chai_1.expect(options).to.haveOwnProperty('mixins');
        chai_1.expect(options.mixins).to.have.length(1);
        var instance = new Mixed;
        chai_1.expect(instance).to.haveOwnProperty('data1');
        chai_1.expect(instance.data1).to.equal(123);
        chai_1.expect(instance.data2).to.equal(456);
        chai_1.expect(instance.myMethod).to.be.a('function');
        chai_1.expect(instance.myMethod2).to.be.a('function');
    });
    it('should mixin instance', function () {
        var MA = (function (_super) {
            __extends(MA, _super);
            function MA() {
                var _this = _super.apply(this, arguments) || this;
                _this.data1 = 123;
                return _this;
            }
            MA.prototype.myMethod = function () { };
            return MA;
        }(index_1.Vue));
        MA = __decorate([
            index_1.Trait,
            __metadata("design:paramtypes", [])
        ], MA);
        var MB = (function (_super) {
            __extends(MB, _super);
            function MB() {
                var _this = _super.apply(this, arguments) || this;
                _this.data2 = 456;
                return _this;
            }
            MB.prototype.myMethod2 = function () { };
            return MB;
        }(index_1.Vue));
        MB = __decorate([
            index_1.Trait,
            __metadata("design:paramtypes", [])
        ], MB);
        var Mixed = (function (_super) {
            __extends(Mixed, _super);
            function Mixed() {
                var _this = _super.apply(this, arguments) || this;
                _this.data3 = 222;
                return _this;
            }
            Mixed.prototype.m = function () {
                this.myMethod();
            };
            return Mixed;
        }(index_1.Mixin(MA, MB)));
        Mixed = __decorate([
            index_1.Component,
            __metadata("design:paramtypes", [])
        ], Mixed);
        var instance = new Mixed;
        chai_1.expect(instance).to.haveOwnProperty('data1');
        chai_1.expect(instance.data1).to.equal(123);
        chai_1.expect(instance.data2).to.equal(456);
        chai_1.expect(instance.myMethod).to.be.a('function');
        chai_1.expect(instance.myMethod2).to.be.a('function');
    });
});
