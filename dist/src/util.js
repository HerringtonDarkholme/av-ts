"use strict";
function NOOP() { }
exports.NOOP = NOOP;
function getReflectType(target, key) {
    if (typeof Reflect === "object" && typeof Reflect.getMetadata === "function") {
        return Reflect.getMetadata('design:type', target, key);
    }
    return null;
}
exports.getReflectType = getReflectType;
function createMap() {
    var ret = Object.create(null);
    ret["__"] = undefined;
    delete ret["__"];
    return ret;
}
exports.createMap = createMap;
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
exports.hasOwn = hasOwn;
