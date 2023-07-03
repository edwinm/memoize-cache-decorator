[![Build status](https://api.travis-ci.com/edwinm/memoize-cache-decorator.svg?branch=master)](https://app.travis-ci.com/github/edwinm/memoize-cache-decorator) [![Coverage Status](https://coveralls.io/repos/github/edwinm/memoize-cache-decorator/badge.svg?branch=master)](https://coveralls.io/github/edwinm/memoize-cache-decorator?branch=master) [![Socket Badge](https://socket.dev/api/badge/npm/package/memoize-cache-decorator)](https://socket.dev/npm/package/memoize-cache-decorator) [![npm version](https://badge.fury.io/js/memoize-cache-decorator.svg)](https://www.npmjs.com/package/memoize-cache-decorator) [![GitHub](https://img.shields.io/github/license/edwinm/memoize-cache-decorator.svg)](https://github.com/edwinm/memoize-cache-decorator/blob/master/LICENSE) [![CodeFactor](https://www.codefactor.io/repository/github/edwinm/memoize-cache-decorator/badge)](https://www.codefactor.io/repository/github/edwinm/memoize-cache-decorator)
# memoize-cache-decorator

> Add the memoize decorator to your class methods to have the results cached
for future calls.

This is an easy, clean and reliable way to prevent repeating unnecessary resource intensive
tasks and improve the performance of your code.

Examples of resource intensive tasks that can be cached are:
heavy calculations, network requests, file system operations and database operations.

With support for:
- For Node.js and browsers (Node.js only as module for now, working on commonjs version)
- Methods and getter functions
- Cache expiration
- Clearing the cache
- Custom resolver function
- TypeScript support

## Installation

```bash
npm install --save-dev memoize-cache-decorator
```

## Usage

```js
class Example {
	@memoize()
	myFunction() {
		// …
	}
}
```

Simple example:

```js
import { memoize } from "memoize-cache-decorator";

class Example {
	@memoize()
	myFunction() {
		return Math.random();
	}
}

const example = new Example();

// Instead of a different random number for each call, the first,
// cached number is returned each time.

console.log(example.myFunction());
//=> 0.7649863352328616
console.log(example.myFunction());
//=> 0.7649863352328616
console.log(example.myFunction());
//=> 0.7649863352328616
```

In practice, the function would probably do a fetch or a database call.

## API

### @memoize(config)

Memoize the class method or getter below it.

#### Type: \[optional\] `Config`

```js
interface Config {
	resolver?: (...args: any[]) => string | number;
	ttl?: number;
}
```

##### resolver \[optional\] function

Function to convert function arguments to a unique key.

Without a `resolver` function, the arguments are converted to a key with JSON stringify.
This works fine when the arguments are primitives like string and number.
This is undesirable when passing in objects with irrelevant of circular data, like DOM elements.
Use `resolver` to provide a function to calculate a unique key yourself.

Example:

```js
import { memoize } from "memoize-cache-decorator";

class Example {
	@memoize({ resolver: (el) => el.id })
	myFunction(el) {
		// el is some complex object
		return fetch(`/rest/example/${el.id}`);
	}
}
```

##### ttl \[optional\] number

With ttl (time to live), the cache will never live longer than
the given number of milliseconds.

```js
import { memoize } from "memoize-cache-decorator";

class Example {
	// The result is cached for at most 10 minutes
	@memoize({ ttl: 10 * 60 * 1000 })
	getComments() {
		return fetch(`/rest/example/comments`);
	}
}
```

### clear(fn)

Clears the cache belonging to a memoized function.

Call `clear` with the memoized function as argument.

```js
import { memoize, clear } from "memoize-cache-decorator";

class Example {
	@memoize()
	getComments() {
		return fetch(`/rest/example/comments`);
	}

	commentsUpdated() {
		// The next time getComments() is called, comments will
		// be fetched from the server.
		clear(this.getComments);
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

MIT © 2023 [Edwin Martin](https://bitstorm.org/)
