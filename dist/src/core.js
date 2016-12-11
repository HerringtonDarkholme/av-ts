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
"use strict";
var Vue = require("vue");
var util_1 = require("./util");
// option is a full-blown Vue compatible option
// meta is vue.ts specific type for annotation, a subset of option
function makeOptionsFromMeta(meta, name) {
    meta.name = name;
    for (var _i = 0, _a = ['props', 'computed', 'watch', 'methods']; _i < _a.length; _i++) {
        var key = _a[_i];
        if (!util_1.hasOwn(meta, key)) {
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
var registeredProcessors = util_1.createMap();
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
var VUE_KEYS = Object.keys(new Vue);
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
        // _init is the only method required for `cls` call
        // for not data property, set as a readonly prop
        // so @Prop does not rewrite it to undefined
        cls.prototype._init = function () {
            var _loop_1 = function (key) {
                if (keys.indexOf(key) >= 0)
                    return "continue";
                Object.defineProperty(this_1, key, {
                    get: function () { return vm[key]; },
                    set: util_1.NOOP
                });
            };
            var this_1 = this;
            for (var _i = 0, _a = Object.keys(vm); _i < _a.length; _i++) {
                var key = _a[_i];
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
    var Super = superProto instanceof Vue
        ? superProto.constructor // TS does not setup constructor :(
        : Vue;
    return Super;
}
function Component_(meta) {
    if (meta === void 0) { meta = {}; }
    function decorate(cls) {
        Component.inDefinition = true;
        // let instance = Object.create(cls.prototype)
        // Object.defineProperty(instance, '_init', {
        //   value: NOOP, enumerable: false
        // })
        cls.prototype._init = util_1.NOOP;
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
        return Super.extend(options);
    }
    return decorate;
}
function Component(target) {
    if (typeof target === 'function') {
        return Component_()(target);
    }
    return Component_(target);
}
exports.Component = Component;
(function (Component) {
    function register(key, logic) {
        registeredProcessors[key] = logic;
    }
    Component.register = register;
    Component.inDefinition = false;
})(Component = exports.Component || (exports.Component = {}));
