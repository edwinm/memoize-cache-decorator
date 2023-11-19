/**!
 @preserve memoize-decorator 1.12.0
 @copyright 2023 Edwin Martin
 @license MIT
 */
import stringify from "json-stringify-safe";
// cacheMap maps every function to a maps with caches
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
        cacheMap.set(propertyDescriptor[prop], functionCacheMap);
        return propertyDescriptor;
    };
}
// Clear all caches for a specific function for all instances
export function clearFunction(fn) {
    const functionCacheMap = cacheMap.get(fn);
    if (functionCacheMap) {
        functionCacheMap.clear();
    }
}
//# sourceMappingURL=memoize.js.map