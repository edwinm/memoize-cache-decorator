/**!
 @preserve memoize-decorator 1.6.0
 @copyright 2023 Edwin Martin
 @license MIT
 */

import stringify from "json-stringify-safe";

const cacheMap = new Map();

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
		const map: Map<string | number, CacheObject> = new Map();

		propertyDescriptor[prop] = function (...args: any[]) {
			const key = config.resolver
				? config.resolver.apply(this, args)
				: stringify(args);

			if (map.has(key)) {
				const { result, timeout } = map.get(key)!;
				if (!config.ttl || timeout > Date.now()) {
					return result;
				}
			}
			const newResult = originalFunction.apply(this, args);
			map.set(key, {
				result: newResult,
				timeout: config.ttl ? Date.now() + config.ttl : Infinity,
			});
			return newResult;
		};

		cacheMap.set(propertyDescriptor[prop], map);

		return propertyDescriptor;
	};
}

export function clear(fn: (...args: any) => any) {
	const map = cacheMap.get(fn);

	if (map) {
		map.clear();
	}
}
