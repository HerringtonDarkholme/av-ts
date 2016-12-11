"use strict";
var core_1 = require("./core");
var RENDER_KEY = '$$Render';
var RENDER = 'render';
function Render(target, key, _) {
    target[RENDER_KEY] = true;
}
exports.Render = Render;
core_1.Component.register(RENDER_KEY, function (proto, instance, options) {
    if (proto[RENDER_KEY]) {
        options[RENDER] = proto[RENDER];
        delete proto[RENDER];
    }
});
