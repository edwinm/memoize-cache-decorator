# memoize-decorator

> Memoize methods

## Usage

```js
class Example {
	@memoize()
	myFunction() {
		// …
	}
}
```

Simple practical example:

```js
import { memoize } from "memoize-decorator";

class Example {
	@memoize()
	myFunction() {
		return Math.random();
	}
}

const example = new Example();

console.log(example.myFunction());
//=> 0.7649863352328616
console.log(example.myFunction());
//=> 0.7649863352328616
console.log(example.myFunction());
//=> 0.7649863352328616
```

## API

### @memoize(config)

Memoize the function below it.

#### amount

Type: \[optional\] `Config`

##### resolver \[optional\]

Function to convert function arguments to a key, which can be a string or a number.

Without a `resolver` function, the arguments are converted to a key with JSON stringify.
This works fine when the arguments are primitives like string and number.
This is undesirable when passing objects with irrelevant of circular data, like DOM elements.
Use `resolver` to provide a function to calculate a unique key yourself.

Example:

```js
import { memoize } from "memoize-decorator";

class Example {
	@memoize({ resolver: (el) => el.id })
	myFunction(el) {
		// el is some complex object
		return fetch(`/rest/example/${el.id}`);
	}
}
```

## Tests

```shell
npm test
```

## Related

- [Wikipedia on Memoization](https://en.wikipedia.org/wiki/Memoization)

## License

MIT © 2019 [Edwin Martin](https://bitstorm.org/)
