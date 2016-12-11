"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var Vue = require("vue");
exports.Vue = Vue;
var core_1 = require("./src/core");
exports.Component = core_1.Component;
var lifecycle_1 = require("./src/lifecycle");
exports.Lifecycle = lifecycle_1.Lifecycle;
var prop_1 = require("./src/prop");
exports.Prop = prop_1.Prop;
exports.p = prop_1.p;
var render_1 = require("./src/render");
exports.Render = render_1.Render;
var transition_1 = require("./src/transition");
exports.Transition = transition_1.Transition;
var watch_1 = require("./src/watch");
exports.Watch = watch_1.Watch;
var watch_sub_1 = require("./src/watch_sub");
exports.WatchSub = watch_sub_1.WatchSub;
var data_1 = require("./src/data");
exports.Data = data_1.Data;
__export(require("./src/functions"));
