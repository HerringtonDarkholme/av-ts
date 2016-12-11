"use strict";
var core_1 = require("./core");
var util_1 = require("./util");
var WATCH_PROP = '$$Watch';
function Watch(key, opt) {
    if (opt === void 0) { opt = {}; }
    return function (target, method) {
        var watchedProps = target[WATCH_PROP] = target[WATCH_PROP] || util_1.createMap();
        opt['handler'] = target[method];
        opt['originalMethod'] = method;
        watchedProps[key] = opt;
    };
}
exports.Watch = Watch;
core_1.Component.register(WATCH_PROP, function (target, instance, optionsToWrite) {
    var watchedProps = target[WATCH_PROP];
    var watch = optionsToWrite.watch;
    for (var key in watchedProps) {
        watch[key] = watchedProps[key];
        delete target[watchedProps[key]['originalMethod']];
    }
});
