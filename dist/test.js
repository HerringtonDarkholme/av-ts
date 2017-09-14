module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: external "vue"
var external__vue_ = __webpack_require__(1);
var external__vue__default = /*#__PURE__*/__webpack_require__.n(external__vue_);

// EXTERNAL MODULE: ./src/global.ts
var global = __webpack_require__(3);
var global_default = /*#__PURE__*/__webpack_require__.n(global);

// CONCATENATED MODULE: ./src/util.ts
function NOOP() { }
function getReflectType(target, key) {
    if (typeof Reflect === "object" && typeof Reflect.getMetadata === "function") {
        return Reflect.getMetadata('design:type', target, key);
    }
    return null;
}
function createMap() {
    var ret = Object.create(null);
    ret["__"] = undefined;
    delete ret["__"];
    return ret;
}
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

// CONCATENATED MODULE: ./src/core.ts
/**
 * The basic idea behind Component is marking on prototype
 * and then process these marks to collect options and modify class/instance.
 *
 * A decorator will mark `internalKey` on prototypes, storgin meta information
 * Then register `DecoratorProcessor` on Component, which will be called in `Component` decorator
 * `DecoratorProcessor` can execute custom logic based on meta information stored before
 *
 * For non-annotated fields, `Component` will treat them as `methods` and `computed` in `option`
 * instance variable is treated as the return value of `data()` in `option`
 *
 * So a `DecoratorProcessor` may delete fields on prototype and instance,
 * preventing meta properties like lifecycle and prop to pollute `method` and `data`
 */


// option is a full-blown Vue compatible option
// meta is vue.ts specific type for annotation, a subset of option
function makeOptionsFromMeta(meta, name) {
    meta.name = meta.name || name;
    for (var _i = 0, _a = ['props', 'computed', 'watch', 'methods']; _i < _a.length; _i++) {
        var key = _a[_i];
        if (!hasOwn(meta, key)) {
            meta[key] = {};
        }
    }
    return meta;
}
// given a vue class' prototype, return its internalKeys and normalKeys
// internalKeys are for decorators' use, like $$Prop, $$Lifecycle
// normalKeys are for methods / computed property
function getKeys(proto) {
    var protoKeys = Object.getOwnPropertyNames(proto);
    var internalKeys = [];
    var normalKeys = [];
    for (var _i = 0, protoKeys_1 = protoKeys; _i < protoKeys_1.length; _i++) {
        var key = protoKeys_1[_i];
        if (key === 'constructor') {
            continue;
        }
        else if (key.substr(0, 2) === '$$') {
            internalKeys.push(key);
        }
        else {
            normalKeys.push(key);
        }
    }
    return {
        internalKeys: internalKeys, normalKeys: normalKeys
    };
}
var registeredProcessors = createMap();
// delegate to processor
function collectInternalProp(propKey, proto, instance, optionsToWrite) {
    var processor = registeredProcessors[propKey];
    if (!processor) {
        return;
    }
    processor(proto, instance, optionsToWrite);
}
// un-annotated and undeleted methods/getters are handled as `methods` and `computed`
function collectMethodsAndComputed(propKey, proto, optionsToWrite) {
    var descriptor = Object.getOwnPropertyDescriptor(proto, propKey);
    if (!descriptor) {
        return;
    }
    if (typeof descriptor.value === 'function') {
        optionsToWrite.methods[propKey] = descriptor.value;
    }
    else if (descriptor.get || descriptor.set) {
        optionsToWrite.computed[propKey] = {
            get: descriptor.get,
            set: descriptor.set,
        };
    }
}
var VUE_KEYS = Object.keys(new external__vue_);
// find all undeleted instance property as the return value of data()
// need to remove Vue keys to avoid cyclic references
function collectData(cls, keys, optionsToWrite) {
    // already implemented by @Data
    if (optionsToWrite.data)
        return;
    // what a closure! :(
    optionsToWrite.data = function () {
        var selfData = {};
        var vm = this;
        var insKeys = Object.keys(vm).concat(Object.keys(vm.$props || {}));
        // _init is the only method required for `cls` call
        // for not data property, set as a readonly prop
        // so @Prop does not rewrite it to undefined
        cls.prototype._init = !vm ? NOOP : function () {
            var _loop_1 = function (key) {
                if (keys.indexOf(key) >= 0)
                    return "continue";
                Object.defineProperty(this_1, key, {
                    get: function () { return vm[key]; },
                    set: NOOP
                });
            };
            var this_1 = this;
            for (var _i = 0, insKeys_1 = insKeys; _i < insKeys_1.length; _i++) {
                var key = insKeys_1[_i];
                _loop_1(key);
            }
        };
        var proxy = new cls();
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (VUE_KEYS.indexOf(key) === -1) {
                selfData[key] = proxy[key];
            }
        }
        return selfData;
    };
}
// find proto's superclass' constructor to correctly extend
function findSuper(proto) {
    // prototype:   {}  -> VueInst -> ParentInst, aka. proto
    // constructor: Vue -> Parent  -> Child
    var superProto = Object.getPrototypeOf(proto);
    var Super = superProto instanceof external__vue_
        ? superProto.constructor // TS does not setup constructor :(
        : external__vue_;
    return Super;
}
var BUILTIN = ['name', 'length', 'prototype', 'arguments', 'caller'];
function Component_(meta) {
    if (meta === void 0) { meta = {}; }
    function decorate(cls) {
        Component.inDefinition = true;
        cls.prototype._init = NOOP;
        var instance = null;
        try {
            instance = new cls();
        }
        finally {
            Component.inDefinition = false;
        }
        delete cls.prototype._init;
        var proto = cls.prototype;
        var options = makeOptionsFromMeta(meta, cls['name']);
        var _a = getKeys(proto), internalKeys = _a.internalKeys, normalKeys = _a.normalKeys;
        for (var _i = 0, internalKeys_1 = internalKeys; _i < internalKeys_1.length; _i++) {
            var protoKey = internalKeys_1[_i];
            collectInternalProp(protoKey, proto, instance, options);
        }
        for (var _b = 0, normalKeys_1 = normalKeys; _b < normalKeys_1.length; _b++) {
            var protoKey = normalKeys_1[_b];
            collectMethodsAndComputed(protoKey, proto, options);
        }
        // everything on instance is packed into data
        collectData(cls, Object.keys(instance), options);
        var Super = findSuper(proto);
        var ret = Super.extend(options);
        var statics = Object.getOwnPropertyNames(cls).filter(function (k) { return BUILTIN.indexOf(k) < 0; });
        for (var _c = 0, statics_1 = statics; _c < statics_1.length; _c++) {
            var key = statics_1[_c];
            ret[key] = cls[key];
        }
        return ret;
    }
    return decorate;
}
function Component(target) {
    if (typeof target === 'function') {
        return Component_()(target);
    }
    return Component_(target);
}
(function (Component) {
    function register(key, logic) {
        registeredProcessors[key] = logic;
    }
    Component.register = register;
    Component.inDefinition = false;
})(Component || (Component = {}));

// CONCATENATED MODULE: ./src/lifecycle.ts


var LIFECYCLE_KEY = '$$Lifecycle';
function Lifecycle(target, life, _) {
    var lifecycles = target[LIFECYCLE_KEY] = target[LIFECYCLE_KEY] || createMap();
    lifecycles[life] = true;
}
Component.register(LIFECYCLE_KEY, function (proto, instance, options) {
    var lifecycles = proto[LIFECYCLE_KEY];
    for (var lifecycle in lifecycles) {
        // lifecycles must be on proto because internalKeys is processed before method
        var handler = proto[lifecycle];
        delete proto[lifecycle];
        options[lifecycle] = handler;
    }
});

// CONCATENATED MODULE: ./src/prop.ts


var PROP_KEY = '$$Prop';
function Prop(target, key) {
    var propKeys = target[PROP_KEY] = target[PROP_KEY] || [];
    propKeys.push(key);
}
Component.register(PROP_KEY, function (proto, instance, options) {
    var propKeys = proto[PROP_KEY];
    var props = options.props = options.props || createMap();
    for (var _i = 0, propKeys_1 = propKeys; _i < propKeys_1.length; _i++) {
        var key = propKeys_1[_i];
        var prop = {};
        if (instance[key] != null) {
            prop = instance[key];
            delete instance[key];
        }
        // refill type if not existing, do we need this?
        if (!prop.type) {
            prop.type = getReflectType(proto, key);
        }
        props[key] = prop;
    }
    options.props = props;
});
function p(confOrType) {
    if (!Component.inDefinition) {
        return undefined;
    }
    if (typeof confOrType === 'function') {
        var tpe = confOrType;
        return { type: tpe };
    }
    var conf = confOrType;
    if (conf.type === Function) {
        conf.default = conf.defaultFunc;
        // TODO: evaluate copying a config rather than delete prop
        delete conf.defaultFunc;
    }
    return conf;
}

// CONCATENATED MODULE: ./src/render.ts

var RENDER_KEY = '$$Render';
var RENDER = 'render';
function Render(target, key, _) {
    target[RENDER_KEY] = true;
}
Component.register(RENDER_KEY, function (proto, instance, options) {
    if (proto[RENDER_KEY]) {
        options[RENDER] = proto[RENDER];
        delete proto[RENDER];
    }
});

// CONCATENATED MODULE: ./src/transition.ts
// for type checking only
function Transition(target, key, _) {
}

// CONCATENATED MODULE: ./src/watch.ts


var WATCH_PROP = '$$Watch';
function Watch(keyOrPath, opt) {
    if (opt === void 0) { opt = {}; }
    var key = Array.isArray(keyOrPath) ? keyOrPath.join('.') : keyOrPath;
    return function (target, method) {
        var watchedProps = target[WATCH_PROP] = target[WATCH_PROP] || createMap();
        opt['handler'] = target[method];
        opt['originalMethod'] = method;
        watchedProps[key] = opt;
    };
}
Component.register(WATCH_PROP, function (target, instance, optionsToWrite) {
    var watchedProps = target[WATCH_PROP];
    var watch = optionsToWrite.watch;
    for (var key in watchedProps) {
        watch[key] = watchedProps[key];
        delete target[watchedProps[key]['originalMethod']];
    }
});

// CONCATENATED MODULE: ./src/data.ts

var DATA_KEY = '$$data';
function Data(target, key, _) {
    target[DATA_KEY] = target[key];
}
Component.register(DATA_KEY, function (proto, instance, options) {
    var dataFunc = proto['data'];
    options.data = function () {
        return dataFunc.call(this);
    };
    delete proto['data'];
});

// CONCATENATED MODULE: ./src/functions.ts
function Mixin(parent) {
    var traits = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        traits[_i - 1] = arguments[_i];
    }
    return parent.extend({ mixins: traits });
}


// CONCATENATED MODULE: ./index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Lifecycle", function() { return Lifecycle; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Prop", function() { return Prop; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "p", function() { return p; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Render", function() { return Render; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Transition", function() { return Transition; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Watch", function() { return Watch; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Data", function() { return Data; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Mixin", function() { return Mixin; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Trait", function() { return Component; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Vue", function() { return external__vue_; });













/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
/* 3 */
/***/ (function(module, exports) {



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./index.ts + 9 modules
var index = __webpack_require__(0);

// CONCATENATED MODULE: ./test/spec.ts
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// import 'reflect-metadata'
var spec_MyMixin = /** @class */ (function (_super) {
    __extends(MyMixin, _super);
    function MyMixin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyMixin = __decorate([
        index["Component"]
    ], MyMixin);
    return MyMixin;
}(index["Vue"]));

var spec_MyComponent = /** @class */ (function (_super) {
    __extends(MyComponent, _super);
    function MyComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.myData = '123';
        _this.funcData = function () {
            console.log('ひふみ');
        };
        _this.plain = Object(index["p"])({ type: Number });
        _this.plain2 = Object(index["p"])(String);
        _this.myProp = Object(index["p"])(Function);
        _this.complex = Object(index["p"])({
            type: Object,
            required: true,
            default: function () {
                return { a: 123, b: 456 };
            }
        });
        _this.required = Object(index["p"])({
            type: Number,
            required: true,
        });
        _this.default = Object(index["p"])({
            default: function () {
                return 123;
            }
        });
        _this.screwed = Object(index["p"])({
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
    MyComponent.prototype.beforeRouteEnter = function () { };
    __decorate([
        index["Prop"],
        __metadata("design:type", Object)
    ], MyComponent.prototype, "plain", void 0);
    __decorate([
        index["Prop"],
        __metadata("design:type", Object)
    ], MyComponent.prototype, "plain2", void 0);
    __decorate([
        index["Prop"],
        __metadata("design:type", Object)
    ], MyComponent.prototype, "myProp", void 0);
    __decorate([
        index["Prop"],
        __metadata("design:type", Object)
    ], MyComponent.prototype, "complex", void 0);
    __decorate([
        index["Prop"],
        __metadata("design:type", Object)
    ], MyComponent.prototype, "required", void 0);
    __decorate([
        index["Prop"],
        __metadata("design:type", Object)
    ], MyComponent.prototype, "default", void 0);
    __decorate([
        index["Prop"],
        __metadata("design:type", Object)
    ], MyComponent.prototype, "screwed", void 0);
    __decorate([
        Object(index["Watch"])('myWatchee'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], MyComponent.prototype, "logWatch", null);
    __decorate([
        index["Lifecycle"],
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MyComponent.prototype, "beforeCreate", null);
    __decorate([
        index["Render"],
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], MyComponent.prototype, "render", null);
    __decorate([
        index["Lifecycle"],
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MyComponent.prototype, "beforeRouteEnter", null);
    MyComponent = __decorate([
        Object(index["Component"])({
            directives: {},
            components: { abc: {} },
            vuex: {},
            filters: {},
            name: 'my-component',
            transitions: {},
            delimiters: ['{{', '}}'],
        })
    ], MyComponent);
    return MyComponent;
}(index["Vue"]));


// EXTERNAL MODULE: external "chai"
var external__chai_ = __webpack_require__(2);
var external__chai__default = /*#__PURE__*/__webpack_require__.n(external__chai_);

// CONCATENATED MODULE: ./test/index.ts
var test___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var test___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



describe('vue component', function () {
    it('should return a vue constructor', function () {
        Object(external__chai_["expect"])(spec_MyComponent).to.haveOwnProperty('options');
        Object(external__chai_["expect"])(spec_MyComponent['options']).to.be.a('object');
    });
    it('should new to a vue instance', function () {
        var a = new spec_MyComponent({
            propsData: {
                complex: { test: 123 },
                required: 456,
            }
        });
        Object(external__chai_["expect"])(a).to.be.instanceOf(index["Vue"]);
    });
    it('should have data function in options', function () {
        var options = spec_MyComponent['options'];
        Object(external__chai_["expect"])(options).to.haveOwnProperty('data');
        Object(external__chai_["expect"])(options.data).to.be.a('function');
        var data = options.data();
        Object(external__chai_["expect"])(data).to.be.a('object');
        Object(external__chai_["expect"])(Object.keys(data)).to.be.eql(['myData', 'funcData', 'myWatchee']);
        Object(external__chai_["expect"])(data['myData']).to.equal('123');
        Object(external__chai_["expect"])(data['funcData']).to.be.a('function');
    });
    it('should have method in options', function () {
        var options = spec_MyComponent['options'];
        Object(external__chai_["expect"])(options).to.haveOwnProperty('methods');
        Object(external__chai_["expect"])(options.methods).to.have.ownProperty('myMethod');
        Object(external__chai_["expect"])(options.methods['myMethod']).to.be.a('function');
        Object(external__chai_["expect"])(Object.keys(options.methods)).to.be.eql(['myMethod', 'created']);
    });
    it('should not have function data in methods', function () {
        var options = spec_MyComponent['options'];
        Object(external__chai_["expect"])(options).to.haveOwnProperty('methods');
        Object(external__chai_["expect"])(options.methods).to.not.have.property('funcData');
    });
    it('should have computed in options', function () {
        var options = spec_MyComponent['options'];
        Object(external__chai_["expect"])(options).to.haveOwnProperty('computed');
        Object(external__chai_["expect"])(options.computed).to.haveOwnProperty('myGetter');
        var myGetter = options.computed['myGetter'];
        Object(external__chai_["expect"])(myGetter).to.be.a('object');
        Object(external__chai_["expect"])(myGetter).to.haveOwnProperty('get');
        Object(external__chai_["expect"])(myGetter.get).to.be.a('function');
    });
    it('should handle array in data', function () {
        var ArrayComp = /** @class */ (function (_super) {
            test___extends(ArrayComp, _super);
            function ArrayComp() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.myArray = [1, 2, 3];
                return _this;
            }
            ArrayComp = test___decorate([
                index["Component"]
            ], ArrayComp);
            return ArrayComp;
        }(index["Vue"]));
        var options = ArrayComp['options'];
        Object(external__chai_["expect"])(options).to.haveOwnProperty('data');
        var data = options.data();
        Object(external__chai_["expect"])(data).to.haveOwnProperty('myArray');
        var myArray = data.myArray;
        Object(external__chai_["expect"])(myArray).to.be.a('array');
        Object(external__chai_["expect"])(myArray.push).to.be.a('function');
        Object(external__chai_["expect"])(myArray).to.have.length(3);
        Object(external__chai_["expect"])(myArray[0]).to.equal(1);
        Object(external__chai_["expect"])(myArray[1]).to.equal(2);
        Object(external__chai_["expect"])(myArray[2]).to.equal(3);
    });
    it('should only handle own property', function () {
        var sbmoz = Object.create({
            watch: function () { }
        });
        Object(external__chai_["expect"])(sbmoz).to.not.have.ownProperty('watch');
        Object(external__chai_["expect"])(sbmoz.watch).to.be.a('function');
        var Test = /** @class */ (function (_super) {
            test___extends(Test, _super);
            function Test() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Test = test___decorate([
                Object(index["Component"])(sbmoz)
            ], Test);
            return Test;
        }(index["Vue"]));
        var options = Test['options'];
        Object(external__chai_["expect"])(options).to.haveOwnProperty('watch');
        Object(external__chai_["expect"])(options.watch).to.be.an('object');
    });
    it('should support static property', function () {
        var A = /** @class */ (function (_super) {
            test___extends(A, _super);
            function A() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            A_1 = A;
            A.method = function () {
                return 456;
            };
            A.prototype.method = function () {
                return A_1.method() + A_1.field;
            };
            A.field = 123;
            A = A_1 = test___decorate([
                index["Component"]
            ], A);
            return A;
            var A_1;
        }(index["Vue"]));
        Object(external__chai_["expect"])(A.field).to.equal(123);
        Object(external__chai_["expect"])(A.method()).to.equal(456);
        var instance = new A();
        Object(external__chai_["expect"])(instance.method()).to.equal(579);
    });
});

// CONCATENATED MODULE: ./test/decorators.ts
var decorators___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var decorators___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var decorators___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var globalCounter = 0;
var decorators_TestData = /** @class */ (function (_super) {
    decorators___extends(TestData, _super);
    function TestData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.a = Object(index["p"])(Number);
        _this.c = 456;
        _this.d = {
            e: {
                f: 123
            }
        };
        return _this;
    }
    TestData.prototype.increaseCounter = function () {
        globalCounter++;
    };
    TestData.prototype.decreaseCounter = function () {
        globalCounter--;
    };
    TestData.prototype.data = function () {
        return {
            c: this.a,
            d: {
                e: {
                    f: 123
                }
            }
        };
    };
    decorators___decorate([
        index["Prop"],
        decorators___metadata("design:type", Object)
    ], TestData.prototype, "a", void 0);
    decorators___decorate([
        Object(index["Watch"])('c', { deep: true }),
        decorators___metadata("design:type", Function),
        decorators___metadata("design:paramtypes", []),
        decorators___metadata("design:returntype", void 0)
    ], TestData.prototype, "increaseCounter", null);
    decorators___decorate([
        Object(index["Watch"])(['d', 'e', 'f']),
        decorators___metadata("design:type", Function),
        decorators___metadata("design:paramtypes", []),
        decorators___metadata("design:returntype", void 0)
    ], TestData.prototype, "decreaseCounter", null);
    decorators___decorate([
        index["Data"],
        decorators___metadata("design:type", Function),
        decorators___metadata("design:paramtypes", []),
        decorators___metadata("design:returntype", void 0)
    ], TestData.prototype, "data", null);
    TestData = decorators___decorate([
        Object(index["Component"])({
            props: {
                b: String
            },
            watch: {
                a: function () {
                    globalCounter++;
                }
            }
        })
    ], TestData);
    return TestData;
}(index["Vue"]));
describe('various decorators', function () {
    it('should handle lifecycle', function () {
        var opt = spec_MyComponent['options'];
        Object(external__chai_["expect"])(opt.beforeCreate).to.be.a('array');
        Object(external__chai_["expect"])(opt).to.not.have.property('created');
        Object(external__chai_["expect"])(opt.methods['created']).to.be.a('function');
    });
    it('should handle render', function () {
        var opt = spec_MyComponent['options'];
        Object(external__chai_["expect"])(opt).to.have.ownProperty('render');
        Object(external__chai_["expect"])(opt.render).to.be.a('function');
    });
    it('should handle watch', function () {
        var opt = spec_MyComponent['options'];
        Object(external__chai_["expect"])(opt.watch).to.have.ownProperty('myWatchee');
    });
    it('should use @Data', function () {
        var opt = decorators_TestData['options'];
        Object(external__chai_["expect"])(opt).to.have.property('data');
        Object(external__chai_["expect"])(opt.data).to.be.a('function');
        Object(external__chai_["expect"])(opt.data.call({ a: 123 }).c).to.equal(123);
        Object(external__chai_["expect"])(opt.methods.data).to.equal(undefined);
        var instance = new decorators_TestData({ propsData: { a: 777 } });
        Object(external__chai_["expect"])(instance).to.have.property('a');
        Object(external__chai_["expect"])(instance.a).to.be.equal(777);
        Object(external__chai_["expect"])(instance.data).to.equal(undefined);
    });
    it('should merge options', function () {
        var opt = decorators_TestData['options'];
        Object(external__chai_["expect"])(opt).to.have.property('props');
        Object(external__chai_["expect"])(opt.props).to.haveOwnProperty('a');
        Object(external__chai_["expect"])(opt.props).to.haveOwnProperty('b');
    });
    it('should merge watch', function () {
        var opt = decorators_TestData['options'];
        Object(external__chai_["expect"])(opt).to.have.property('watch');
        Object(external__chai_["expect"])(opt.watch).to.haveOwnProperty('a');
        Object(external__chai_["expect"])(opt.watch).to.haveOwnProperty('c');
        Object(external__chai_["expect"])(opt.watch).to.haveOwnProperty('d.e.f');
        Object(external__chai_["expect"])(opt.watch.c).to.haveOwnProperty('deep');
        Object(external__chai_["expect"])(opt.watch.c.deep).to.equal(true);
    });
    it('should handle various data initilization', function () {
        var Test = /** @class */ (function () {
            function Test() {
            }
            return Test;
        }());
        var sharedObject = {};
        var counter = 0;
        function cp(t) {
            if (index["Component"].inDefinition) {
                counter++;
                return t;
            }
            return undefined;
        }
        var TestComponent = /** @class */ (function (_super) {
            decorators___extends(TestComponent, _super);
            function TestComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.propValue = cp(Number);
                _this.normal = 'normal';
                _this.test = new Test;
                _this.own = _this.propValue + 1;
                _this.shared = sharedObject;
                return _this;
            }
            decorators___decorate([
                index["Prop"],
                decorators___metadata("design:type", Object)
            ], TestComponent.prototype, "propValue", void 0);
            TestComponent = decorators___decorate([
                index["Component"]
            ], TestComponent);
            return TestComponent;
        }(index["Vue"]));
        var instance = new TestComponent({
            propsData: { propValue: 123 }
        });
        Object(external__chai_["expect"])(instance.normal).to.equal('normal');
        Object(external__chai_["expect"])(instance.test).to.be.instanceOf(Test);
        Object(external__chai_["expect"])(instance.own).to.equal(124);
        Object(external__chai_["expect"])(instance.shared).to.equal(sharedObject);
        Object(external__chai_["expect"])(counter).to.equal(1);
    });
    it('should make watch run', function (done) {
        var instance = new decorators_TestData({
            propsData: { b: 'test', a: 123 }
        });
        Object(external__chai_["expect"])(globalCounter).to.equal(0);
        instance.c = 111;
        instance.$nextTick(function () {
            Object(external__chai_["expect"])(globalCounter).to.equal(1);
            instance.a = 321;
            instance.$nextTick(function () {
                Object(external__chai_["expect"])(globalCounter).to.equal(2);
                done();
            });
        });
    });
    it('should watch nested prop', function (done) {
        var instance = new decorators_TestData({
            propsData: { b: 'test', a: 123 }
        });
        Object(external__chai_["expect"])(globalCounter).to.equal(2);
        instance.d.e.f = 111;
        instance.$nextTick(function () {
            Object(external__chai_["expect"])(globalCounter).to.equal(1);
            done();
        });
    });
    it('should watch nested optional prop', function () {
        var Comp = /** @class */ (function (_super) {
            decorators___extends(Comp, _super);
            function Comp() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Comp.prototype.handler = function (newValue) {
            };
            decorators___decorate([
                Object(index["Watch"])(['member', 'prop']),
                decorators___metadata("design:type", Function),
                decorators___metadata("design:paramtypes", [Number]),
                decorators___metadata("design:returntype", void 0)
            ], Comp.prototype, "handler", null);
            return Comp;
        }(index["Vue"]));
        Comp;
    });
});

// CONCATENATED MODULE: ./test/functions.ts
var functions___extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var functions___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


describe('util functions', function () {
    it('Trait should work like component', function () {
        Object(external__chai_["expect"])(index["Trait"]).to.be.equal(index["Component"]);
    });
    it('should mixin', function () {
        var MA = /** @class */ (function (_super) {
            functions___extends(MA, _super);
            function MA() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.data1 = 123;
                return _this;
            }
            MA.prototype.myMethod = function () { };
            MA = functions___decorate([
                index["Trait"]
            ], MA);
            return MA;
        }(index["Vue"]));
        var MB = /** @class */ (function (_super) {
            functions___extends(MB, _super);
            function MB() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.data2 = 456;
                return _this;
            }
            MB.prototype.myMethod2 = function () { };
            MB = functions___decorate([
                index["Trait"]
            ], MB);
            return MB;
        }(index["Vue"]));
        var Mixed = Object(index["Mixin"])(MA, MB);
        Object(external__chai_["expect"])(Mixed).to.be.a('function');
        var options = Mixed['options'];
        Object(external__chai_["expect"])(options).to.haveOwnProperty('mixins');
        Object(external__chai_["expect"])(options.mixins).to.have.length(1);
        var instance = new Mixed;
        Object(external__chai_["expect"])(instance).to.haveOwnProperty('data1');
        Object(external__chai_["expect"])(instance.data1).to.equal(123);
        Object(external__chai_["expect"])(instance.data2).to.equal(456);
        Object(external__chai_["expect"])(instance.myMethod).to.be.a('function');
        Object(external__chai_["expect"])(instance.myMethod2).to.be.a('function');
    });
    it('should mixin instance', function () {
        var MA = /** @class */ (function (_super) {
            functions___extends(MA, _super);
            function MA() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.data1 = 123;
                return _this;
            }
            MA.prototype.myMethod = function () { };
            MA = functions___decorate([
                index["Trait"]
            ], MA);
            return MA;
        }(index["Vue"]));
        var MB = /** @class */ (function (_super) {
            functions___extends(MB, _super);
            function MB() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.data2 = 456;
                return _this;
            }
            MB.prototype.myMethod2 = function () { };
            MB = functions___decorate([
                index["Trait"]
            ], MB);
            return MB;
        }(index["Vue"]));
        var Mixed = /** @class */ (function (_super) {
            functions___extends(Mixed, _super);
            function Mixed() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.data3 = 222;
                return _this;
            }
            Mixed.prototype.m = function () {
                this.myMethod();
            };
            Mixed = functions___decorate([
                index["Component"]
            ], Mixed);
            return Mixed;
        }(Object(index["Mixin"])(MA, MB)));
        var instance = new Mixed;
        Object(external__chai_["expect"])(instance).to.haveOwnProperty('data1');
        Object(external__chai_["expect"])(instance.data1).to.equal(123);
        Object(external__chai_["expect"])(instance.data2).to.equal(456);
        Object(external__chai_["expect"])(instance.myMethod).to.be.a('function');
        Object(external__chai_["expect"])(instance.myMethod2).to.be.a('function');
    });
    it('more traits', function () {
        var A = /** @class */ (function (_super) {
            functions___extends(A, _super);
            function A() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.a = 1;
                return _this;
            }
            A = functions___decorate([
                index["Trait"]
            ], A);
            return A;
        }(index["Vue"]));
        var B = /** @class */ (function (_super) {
            functions___extends(B, _super);
            function B() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.b = 2;
                return _this;
            }
            B = functions___decorate([
                index["Trait"]
            ], B);
            return B;
        }(index["Vue"]));
        var C = /** @class */ (function (_super) {
            functions___extends(C, _super);
            function C() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.c = 3;
                return _this;
            }
            C = functions___decorate([
                index["Trait"]
            ], C);
            return C;
        }(index["Vue"]));
        var D = /** @class */ (function (_super) {
            functions___extends(D, _super);
            function D() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.d = 4;
                return _this;
            }
            D = functions___decorate([
                index["Trait"]
            ], D);
            return D;
        }(index["Vue"]));
        var E = /** @class */ (function (_super) {
            functions___extends(E, _super);
            function E() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.e = 5;
                return _this;
            }
            E = functions___decorate([
                index["Trait"]
            ], E);
            return E;
        }(index["Vue"]));
        var Mixed = /** @class */ (function (_super) {
            functions___extends(Mixed, _super);
            function Mixed() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Mixed = functions___decorate([
                index["Component"]
            ], Mixed);
            return Mixed;
        }(Object(index["Mixin"])(A, B, C, D, E)));
        var instance = new Mixed;
        Object(external__chai_["expect"])(instance.a).to.equal(1);
        Object(external__chai_["expect"])(instance.b).to.equal(2);
        Object(external__chai_["expect"])(instance.c).to.equal(3);
        Object(external__chai_["expect"])(instance.d).to.equal(4);
        Object(external__chai_["expect"])(instance.e).to.equal(5);
        var TestType = /** @class */ (function (_super) {
            functions___extends(TestType, _super);
            function TestType() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TestType = functions___decorate([
                Object(index["Component"])({
                    components: {
                        Mixed: Mixed
                    }
                })
            ], TestType);
            return TestType;
        }(index["Vue"]));
        TestType;
    });
});

// CONCATENATED MODULE: ./test/prop.ts


describe('prop options', function () {
    it('should have prop suboptions in options', function () {
        var options = spec_MyComponent['options'];
        Object(external__chai_["expect"])(options).to.haveOwnProperty('props');
        var props = options.props;
        Object(external__chai_["expect"])(props).to.be.a('object');
        Object(external__chai_["expect"])(props).to.haveOwnProperty('myProp');
        Object(external__chai_["expect"])(props).to.haveOwnProperty('complex');
        Object(external__chai_["expect"])(props).to.haveOwnProperty('screwed');
    });
    it('should handle simple prop option', function () {
        var props = spec_MyComponent['options'].props;
        Object(external__chai_["expect"])(props['myProp']).to.deep.equal({ type: Function }, 'simple prop');
    });
    it('it should handle complex prop', function () {
        var props = spec_MyComponent['options'].props;
        var complex = props['complex'];
        Object(external__chai_["expect"])(complex['type']).to.equal(Object);
        Object(external__chai_["expect"])(complex['required']).to.equal(true);
        Object(external__chai_["expect"])(complex['default']).to.be.a('function');
        var defaultProp1 = complex['default']();
        Object(external__chai_["expect"])(defaultProp1).to.deep.equal({ a: 123, b: 456 });
        var defaultProp2 = complex['default']();
        Object(external__chai_["expect"])(defaultProp2).to.deep.equal({ a: 123, b: 456 }, 'idempotency');
        Object(external__chai_["expect"])(defaultProp1).to.not.equal(defaultProp2);
    });
    it('should handle prop for function', function () {
        var props = spec_MyComponent['options'].props;
        var screwed = props['screwed'];
        Object(external__chai_["expect"])(screwed['type']).to.equal(Function);
        Object(external__chai_["expect"])(screwed['default']).to.be.a('function');
        Object(external__chai_["expect"])(screwed).to.not.haveOwnProperty('defaultFunc');
        Object(external__chai_["expect"])(screwed['defaultFunc']).to.equal(undefined);
    });
    it('should not set in data options', function () {
        var data = spec_MyComponent['options'].data;
        Object(external__chai_["expect"])(data).to.not.have.property('myProp');
        Object(external__chai_["expect"])(data).to.not.have.property('complex');
        Object(external__chai_["expect"])(data).to.not.have.property('screwed');
    });
    it('should new instance', function () {
        var instance = new spec_MyComponent({
            propsData: {
                complex: { test: 123 },
                required: 456,
            }
        });
        Object(external__chai_["expect"])(instance.required).to.equal(456);
        Object(external__chai_["expect"])(instance.complex['test']).to.equal(123);
    });
});

// CONCATENATED MODULE: ./test/test.ts







/***/ })
/******/ ]);