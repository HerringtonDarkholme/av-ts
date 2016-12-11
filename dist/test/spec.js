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
var index_1 = require("../index");
// import 'reflect-metadata'
var MyMixin = (function (_super) {
    __extends(MyMixin, _super);
    function MyMixin() {
        return _super.apply(this, arguments) || this;
    }
    return MyMixin;
}(index_1.Vue));
MyMixin = __decorate([
    index_1.Component,
    __metadata("design:paramtypes", [])
], MyMixin);
exports.MyMixin = MyMixin;
var MyComponent = (function (_super) {
    __extends(MyComponent, _super);
    function MyComponent() {
        var _this = _super.apply(this, arguments) || this;
        _this.myData = '123';
        _this.funcData = function () {
            console.log('ひふみ');
        };
        _this.myProp = index_1.p(Function);
        _this.complex = index_1.p({
            type: Object,
            required: true,
            default: function () {
                return { a: 123, b: 456 };
            }
        });
        _this.required = index_1.p({
            type: Number,
            required: true,
        });
        _this.default = index_1.p({
            default: function () {
                return 123;
            }
        });
        _this.screwed = index_1.p({
            type: Function,
            // bug: TS cannot infer return type
            defaultFunc: function (a) {
                return false;
            }
        });
        _this.myWatchee = 'watch me!';
        return _this;
    }
    MyComponent.prototype.myMethod = function () {
    };
    Object.defineProperty(MyComponent.prototype, "myGetter", {
        get: function () {
            return this.myProp;
        },
        enumerable: true,
        configurable: true
    });
    MyComponent.prototype.logWatch = function (str) {
        console.log(this.myData);
    };
    // lifecycle
    MyComponent.prototype.beforeCreate = function () { };
    // as method
    MyComponent.prototype.created = function () { };
    MyComponent.prototype.render = function (h) {
        return h('h1', 'Daisuke');
    };
    return MyComponent;
}(index_1.Vue));
__decorate([
    index_1.Prop,
    __metadata("design:type", Object)
], MyComponent.prototype, "myProp", void 0);
__decorate([
    index_1.Prop,
    __metadata("design:type", Object)
], MyComponent.prototype, "complex", void 0);
__decorate([
    index_1.Prop,
    __metadata("design:type", Object)
], MyComponent.prototype, "required", void 0);
__decorate([
    index_1.Prop,
    __metadata("design:type", Object)
], MyComponent.prototype, "default", void 0);
__decorate([
    index_1.Prop,
    __metadata("design:type", Object)
], MyComponent.prototype, "screwed", void 0);
__decorate([
    index_1.Watch('myWatchee'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MyComponent.prototype, "logWatch", null);
__decorate([
    index_1.Lifecycle,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MyComponent.prototype, "beforeCreate", null);
__decorate([
    index_1.Render,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], MyComponent.prototype, "render", null);
MyComponent = __decorate([
    index_1.Component({
        directives: {},
        components: { abc: {} },
        vuex: {},
        filters: {},
        name: 'my-component',
        transitions: {},
        delimiters: ['{{', '}}'],
    }),
    __metadata("design:paramtypes", [])
], MyComponent);
exports.MyComponent = MyComponent;
