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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
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
/* 2 */,
/* 3 */
/***/ (function(module, exports) {



/***/ })
/******/ ]);