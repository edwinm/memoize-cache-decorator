/**!
 @preserve memoize-decorator 2.0.0
 @copyright 2023 Edwin Martin
 @license MIT
 */
import stringify from "json-stringify-safe";
// cacheMap maps every function to a map with caches
const cacheMap = new Map();
// instanceMap maps every instance to a unique id
const instanceMap = new Map();
let instanceIdCounter = 1;
export function memoize(config = {}) {
    return function (target, propertyName, propertyDescriptor) {
        const prop = propertyDescriptor.value ? "value" : "get";
        const originalFunction = propertyDescriptor[prop];
        // functionCacheMap maps every instance plus arguments to a CacheObject
        const functionCacheMap = new Map();
        propertyDescriptor[prop] = function (...args) {
            let instanceId = instanceMap.get(this);
            if (!instanceId) {
                instanceId = ++instanceIdCounter;
                instanceMap.set(this, instanceId);
            }
            const key = config.resolver
                ? config.resolver.apply(this, args)
                : stringify(args);
            const cacheKey = `${instanceId}:${key}`;
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
        cacheMap.set(propertyDescriptor[prop], {
            functionCacheMap,
            resolver: config.resolver,
        });
        return propertyDescriptor;
    };
}
// Clear all caches for a specific function for all instances
export function clearFunction(fn) {
    const functionCache = cacheMap.get(fn);
    if (functionCache) {
        functionCache.functionCacheMap.clear();
    }
}
// Clear the cache for an instance and for specific arguments
export function clear(instance, fn, ...args) {
    const functionCache = cacheMap.get(fn);
    const instanceId = instanceMap.get(instance);
    if (!functionCache || !instanceId) {
        return;
    }
    const key = functionCache.resolver
        ? functionCache.resolver.apply(instance, args)
        : stringify(args);
    const cacheKey = `${instanceId}:${key}`;
    functionCache.functionCacheMap.delete(cacheKey);
}
//# sourceMappingURL=memoize.js.map