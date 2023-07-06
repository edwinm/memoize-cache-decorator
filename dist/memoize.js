/**!
 @preserve memoize-decorator 1.5.0
 @copyright 2023 Edwin Martin
 @license MIT
 */
import stringify from "json-stringify-safe";
const cacheMap = new Map();
export function memoize(config = {}) {
    return function (target, propertyName, propertyDescriptor) {
        let timeout = Infinity;
        const prop = propertyDescriptor.value ? "value" : "get";
        const originalFunction = propertyDescriptor[prop];
        const map = new Map();
        propertyDescriptor[prop] = function (...args) {
            const key = config.resolver
                ? config.resolver.apply(this, args)
                : stringify(args);
            if (map.has(key) && (!config.ttl || timeout > Date.now())) {
                return map.get(key);
            }
            else {
                const result = originalFunction.apply(this, args);
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
export function clear(fn) {
    const map = cacheMap.get(fn);
    if (map) {
        map.clear();
    }
}
//# sourceMappingURL=memoize.js.map