const map = new Map();

export function memoize() {
    return function(
        target: Object,
        propertyName: string,
        propertyDesciptor: PropertyDescriptor
    ): PropertyDescriptor {
        const fn = propertyDesciptor.value;

        propertyDesciptor.value = function(...args) {
          let json = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
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
