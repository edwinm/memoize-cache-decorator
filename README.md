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

Complete practical example:

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

### @memoize()

Memoize the function below it.

## Tests

```shell
npm test
```

## Related

- [Wikipedia on Memoization](https://en.wikipedia.org/wiki/Memoization)

## License

MIT © 2019 [Edwin Martin](https://bitstorm.org/)
