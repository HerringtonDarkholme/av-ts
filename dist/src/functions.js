"use strict";
function Mixin(parent) {
    var traits = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        traits[_i - 1] = arguments[_i];
    }
    return parent.extend({ mixins: traits });
}
exports.Mixin = Mixin;
var core_1 = require("./core");
exports.Trait = core_1.Component;
