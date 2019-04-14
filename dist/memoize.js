"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function memoize() {
    return function (target, propertyName, propertyDesciptor) {
        var fn = propertyDesciptor.value;
        var map = new Map();
        propertyDesciptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var json = JSON.stringify(args);
            if (map.has(json)) {
                return map.get(json);
            }
            else {
                var result = fn.apply(this, args);
                map.set(json, result);
                return result;
            }
        };
        return propertyDesciptor;
    };
}
exports.memoize = memoize;
//# sourceMappingURL=memoize.js.map