"use strict";
/**!
 @preserve memoize-decorator 1.1.0
 @copyright 2019 Edwin Martin
 @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
var cacheMap = new Map();
function memoize(config) {
    if (config === void 0) { config = {}; }
    return function (target, propertyName, propertyDesciptor) {
        var timeout = Infinity;
        var prop = propertyDesciptor.value ? "value" : "get";
        var fn = propertyDesciptor[prop];
        var map = new Map();
        propertyDesciptor[prop] = function () {
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
                var result = fn.apply(this, args);
                map.set(key, result);
                if (config.ttl) {
                    timeout = Date.now() + config.ttl;
                }
                return result;
            }
        };
        cacheMap.set(propertyDesciptor[prop], map);
        return propertyDesciptor;
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