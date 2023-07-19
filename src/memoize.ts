/**!
 @preserve memoize-decorator 1.8.0
 @copyright 2023 Edwin Martin
 @license MIT
 */

import stringify from "json-stringify-safe";

const cacheMap = new Map<(...args: any) => any, Map<string, CacheObject>>();

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

		propertyDescriptor[prop] = function (
			this: { [id: symbol]: number },
			...args: any[]
		) {
			const key = config.resolver
				? config.resolver.apply(this, args).toString()
				: stringify(args);

			if (functionCacheMap.has(key)) {
				const { result, timeout } = functionCacheMap.get(key)!;
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

export function clear(fn: (...args: any) => any) {
	const functionCacheMap = cacheMap.get(fn);

	if (functionCacheMap) {
		functionCacheMap.clear();
	}
}
