"use strict";
/**!
 @preserve memoize-decorator 1.3.4
 @copyright 2020 Edwin Martin
 @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.memoize = void 0;
var cacheMap = new Map();
function memoize(config) {
    if (config === void 0) { config = {}; }
    return function (target, propertyName, propertyDescriptor) {
        var timeout = Infinity;
        var prop = propertyDescriptor.value ? "value" : "get";
        var originalFunction = propertyDescriptor[prop];
        var map = new Map();
        propertyDescriptor[prop] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var key = config.resolver
                ? config.resolver.apply(this, args)
                : JSON.stringify(args);
            if (map.has(key) && (!config.ttl || timeout > Date.now())) {
                return map.get(key);
            }
            else {
                var result = originalFunction.apply(this, args);
                map.set(key, result);
                if (config.ttl) {
                    timeout = Date.now() + config.ttl;
                }
                return result;
            }
        };
        cacheMap.set(propertyDescriptor[prop], map);
        return propertyDescriptor;
    };
}
exports.memoize = memoize;
function clear(fn) {
    var map = cacheMap.get(fn);
    if (map) {
        map.clear();
    }
}
exports.clear = clear;
//# sourceMappingURL=memoize.js.map