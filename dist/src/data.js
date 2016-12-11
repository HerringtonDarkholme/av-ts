"use strict";
var core_1 = require("./core");
var DATA_KEY = '$$data';
function Data(target, key, _) {
    target[DATA_KEY] = target[key];
}
exports.Data = Data;
core_1.Component.register(DATA_KEY, function (proto, instance, options) {
    var dataFunc = proto['data'];
    options.data = function () {
        return dataFunc.call(this);
    };
    delete proto['data'];
});
