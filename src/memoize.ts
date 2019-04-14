export interface Config {
	resolver?: (...args: any[]) => string | number;
}

export function memoize(config: Config = {}) {
	return function(
		target: object,
		propertyName: string,
		propertyDesciptor: PropertyDescriptor
	): PropertyDescriptor {
		const fn = propertyDesciptor.value;
		const map = new Map();

		propertyDesciptor.value = function(...args) {
			let key;
			key = config.resolver
				? config.resolver.apply(this, args)
				: JSON.stringify(args);
			if (map.has(key)) {
				return map.get(key);
			} else {
				const result = fn.apply(this, args);
				map.set(key, result);
				return result;
			}
		};

		return propertyDesciptor;
	};
}
