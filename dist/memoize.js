"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function memoize(config) {
    if (config === void 0) { config = {}; }
    return function (target, propertyName, propertyDesciptor) {
        var fn = propertyDesciptor.value;
        var map = new Map();
        propertyDesciptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var key;
            key = config.resolver
                ? config.resolver.apply(this, args)
                : JSON.stringify(args);
            if (map.has(key)) {
                return map.get(key);
            }
            else {
                var result = fn.apply(this, args);
                map.set(key, result);
                return result;
            }
        };
        return propertyDesciptor;
    };
}
exports.memoize = memoize;
//# sourceMappingURL=memoize.js.map