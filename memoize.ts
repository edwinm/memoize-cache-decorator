export function memoize() {
    return function(
        target: Object,
        propertyName: string,
        propertyDesciptor: PropertyDescriptor
    ): PropertyDescriptor {
        const fn = propertyDesciptor.value;
		    const map = new Map();

        propertyDesciptor.value = function(...args) {
          let json = JSON.stringify(args);
            if (map.has(json)) {
                return map.get(json);
            } else {
                const result = fn.apply(this, args);
                map.set(json, result);
                return result;
            }
        };

        return propertyDesciptor;
    };
}
