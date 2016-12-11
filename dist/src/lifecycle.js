"use strict";
var core_1 = require("./core");
var util_1 = require("./util");
var LIFECYCLE_KEY = '$$Lifecycle';
function Lifecycle(target, life, _) {
    var lifecycles = target[LIFECYCLE_KEY] = target[LIFECYCLE_KEY] || util_1.createMap();
    lifecycles[life] = true;
}
exports.Lifecycle = Lifecycle;
core_1.Component.register(LIFECYCLE_KEY, function (proto, instance, options) {
    var lifecycles = proto[LIFECYCLE_KEY];
    for (var lifecycle in lifecycles) {
        // lifecycles must be on proto because internalKeys is processed before method
        var handler = proto[lifecycle];
        delete proto[lifecycle];
        options[lifecycle] = handler;
    }
});
