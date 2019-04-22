/**!
 @preserve memoize-decorator 1.2.0
 @copyright 2019 Edwin Martin
 @license MIT
 */

const cacheMap = new Map();

export interface Config {
	resolver?: (...args: any[]) => string | number;
	ttl?: number;
}

export function memoize(config: Config = {}) {
	return function(
		target: object,
		propertyName: string,
		propertyDesciptor: PropertyDescriptor
	): PropertyDescriptor {
		let timeout = Infinity;
		const prop = propertyDesciptor.value ? "value" : "get";

		const originalFunction = propertyDesciptor[prop];
		const map = new Map();

		propertyDesciptor[prop] = function(...args) {
			let key = config.resolver
				? config.resolver.apply(this, args)
				: JSON.stringify(args);

			if (map.has(key) && (!config.ttl || timeout > Date.now())) {
				return map.get(key);
			} else {
				const result = originalFunction.apply(this, args);
				map.set(key, result);
				if (config.ttl) {
					timeout = Date.now() + config.ttl;
				}
				return result;
			}
		};

		cacheMap.set(propertyDesciptor[prop], map);

		return propertyDesciptor;
	};
}

export function clear(fn: () => any) {
	const map = cacheMap.get(fn);

	if (map) {
		map.clear();
	}
}
