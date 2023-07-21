/**!
 @preserve memoize-decorator 1.10.0
 @copyright 2023 Edwin Martin
 @license MIT
 */

import stringify from "json-stringify-safe";

const cacheMap = new Map<(...args: any) => any, Map<string, CacheObject>>();
const instanceMap = new Map<object, number>();
let uniqueInstanceId = 1;

export interface Config {
	resolver?: (...args: any[]) => string | number;
	ttl?: number;
}

interface CacheObject {
	result: any;
	timeout: number;
}

export function memoize(config: Config = {}) {
	return function (
		target: object,
		propertyName: string,
		propertyDescriptor: PropertyDescriptor
	): PropertyDescriptor {
		const prop = propertyDescriptor.value ? "value" : "get";

		const originalFunction = propertyDescriptor[prop];
		const functionCacheMap = new Map<string, CacheObject>();

		propertyDescriptor[prop] = function (...args: any[]) {
			let objectId = instanceMap.get(this);
			if (!objectId) {
				objectId = ++uniqueInstanceId;
				instanceMap.set(this, objectId);
			}

			const key = config.resolver
				? config.resolver.apply(this, args)
				: stringify(args);

			const cacheKey = `${objectId}:${key}`;

			if (functionCacheMap.has(cacheKey)) {
				const { result, timeout } = functionCacheMap.get(cacheKey)!;
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

export function clear(fn: (...args: any) => any) {
	const functionCacheMap = cacheMap.get(fn);

	if (functionCacheMap) {
		functionCacheMap.clear();
	}
}
