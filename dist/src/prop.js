"use strict";
var core_1 = require("./core");
var util_1 = require("./util");
var PROP_KEY = '$$Prop';
function Prop(target, key) {
    var propKeys = target[PROP_KEY] = target[PROP_KEY] || [];
    propKeys.push(key);
}
exports.Prop = Prop;
core_1.Component.register(PROP_KEY, function (proto, instance, options) {
    var propKeys = proto[PROP_KEY];
    var props = options.props = options.props || util_1.createMap();
    for (var _i = 0, propKeys_1 = propKeys; _i < propKeys_1.length; _i++) {
        var key = propKeys_1[_i];
        var prop = {};
        if (instance[key] != null) {
            prop = instance[key];
            delete instance[key];
        }
        // refill type if not existing, do we need this?
        if (!prop.type) {
            prop.type = util_1.getReflectType(proto, key);
        }
        props[key] = prop;
    }
    options.props = props;
});
function p(confOrType) {
    if (!core_1.Component.inDefinition) {
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
exports.p = p;
