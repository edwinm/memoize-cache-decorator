/**!
 @preserve memoize-decorator 1.8.0
 @copyright 2023 Edwin Martin
 @license MIT
 */
import stringify from "json-stringify-safe";
const cacheMap = new Map();
export function memoize(config = {}) {
    return function (target, propertyName, propertyDescriptor) {
        const prop = propertyDescriptor.value ? "value" : "get";
        const originalFunction = propertyDescriptor[prop];
        const functionCacheMap = new Map();
        propertyDescriptor[prop] = function (...args) {
            const key = config.resolver
                ? config.resolver.apply(this, args).toString()
                : stringify(args);
            if (functionCacheMap.has(key)) {
                const { result, timeout } = functionCacheMap.get(key);
                if (!config.ttl || timeout > Date.now()) {
                    return result;
                }
            }
            const newResult = originalFunction.apply(this, args);
            functionCacheMap.set(key, {
                result: newResult,
                timeout: config.ttl ? Date.now() + config.ttl : Infinity,
            });
            return newResult;
        };
        cacheMap.set(propertyDescriptor[prop], functionCacheMap);
        return propertyDescriptor;
    };
}
export function clear(fn) {
    const functionCacheMap = cacheMap.get(fn);
    if (functionCacheMap) {
        functionCacheMap.clear();
    }
}
//# sourceMappingURL=memoize.js.map