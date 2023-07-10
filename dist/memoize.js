/**!
 @preserve memoize-decorator 1.7.0
 @copyright 2023 Edwin Martin
 @license MIT
 */
import stringify from "json-stringify-safe";
const cacheMap = new Map();
const idPropertySymbol = Symbol();
let uniqueObjectId = 1;
export function memoize(config = {}) {
    return function (target, propertyName, propertyDescriptor) {
        const prop = propertyDescriptor.value ? "value" : "get";
        const originalFunction = propertyDescriptor[prop];
        const functionCacheMap = new Map();
        propertyDescriptor[prop] = function (...args) {
            let objectId = this[idPropertySymbol];
            if (!objectId) {
                objectId = ++uniqueObjectId;
                this[idPropertySymbol] = objectId;
            }
            const key = config.resolver
                ? config.resolver.apply(this, args)
                : stringify(args);
            const cacheKey = `${objectId}:${key}`;
            if (functionCacheMap.has(cacheKey)) {
                const { result, timeout } = functionCacheMap.get(cacheKey);
                if (!config.ttl || timeout > Date.now()) {
                    return result;
                }
            }
            const newResult = originalFunction.apply(this, args);
            functionCacheMap.set(cacheKey, {
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