export interface Config {
	resolver?: (...args: any[]) => string | number;
}

export function memoize(config: Config = {}) {
	return function(
		target: object,
		propertyName: string,
		propertyDesciptor: PropertyDescriptor
	): PropertyDescriptor {
		const prop = propertyDesciptor.value ? "value" : "get";

		const fn = propertyDesciptor[prop];
		const map = new Map();

		propertyDesciptor[prop] = function(...args) {
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
