[![Test](https://github.com/edwinm/memoize-cache-decorator/actions/workflows/test.yml/badge.svg)](https://github.com/edwinm/memoize-cache-decorator/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/edwinm/memoize-cache-decorator/badge.svg?branch=master)](https://coveralls.io/github/edwinm/memoize-cache-decorator?branch=master) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=edwinm_memoize-cache-decorator&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=edwinm_memoize-cache-decorator) [![Socket Badge](https://socket.dev/api/badge/npm/package/memoize-cache-decorator)](https://socket.dev/npm/package/memoize-cache-decorator) [![CodeFactor](https://www.codefactor.io/repository/github/edwinm/memoize-cache-decorator/badge)](https://www.codefactor.io/repository/github/edwinm/memoize-cache-decorator) [![npm version](https://badge.fury.io/js/memoize-cache-decorator.svg)](https://www.npmjs.com/package/memoize-cache-decorator) [![GitHub](https://img.shields.io/github/license/edwinm/memoize-cache-decorator.svg)](https://github.com/edwinm/memoize-cache-decorator/blob/master/LICENSE)

# memoize-cache-decorator

> Add the memoize decorator to your class methods to have the results cached
> for future calls.

This is an easy, clean and reliable way to prevent repeating unnecessary resource intensive
tasks and improve the performance of your code.

Examples of resource intensive tasks that can be cached are:
heavy calculations, network requests, file system operations and database operations.

With support for:

- Both Node.js and browsers
- Methods and getter functions
- Async functions
- Static functions
- Cache expiration
- Clearing the cache
- Custom resolver function

Since TypeScript decorators are used, the source has to be TypeScript.
Also, decorators can only be used for class methods and getters.
Plain JavaScript decorators are planned for the future.

## Roadmap

Before autumn 2023: make cache clearing more precise.

## Installation

```bash
npm install --save-dev memoize-cache-decorator
```

## Usage

```ts
class Example {
	@memoize()
	myFunction() {
		// …
	}
}
```

Simple example:

```ts
import { memoize } from "memoize-cache-decorator";

class Example {
	@memoize()
	myFunction() {
		// Heavy function getting data from disk, database or a server
		// For this example we return a random number
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

In practice, the function would probably do a fetch, read a file or do a database call.

```ts
import { memoize, clear } from "memoize-cache-decorator";

class Example {
	@memoize({ ttl: 5 * 60 * 1000 })
	async getData(path: string) {
		try {
			const response = await fetch(path, {
				headers: {
					Accept: "application/json",
				},
			});
			return response.json();
		} catch (error) {
			console.error(
				`While fetching ${path}, the following error occured`,
				error
			);
			return error;
		}
	}
}

const example = new Example();

const data = await example.getData("/path-to-data");
```

Now, every time `getData` is called with this path, it returns the data without
fetching over the network it every time.
It will do a fetch over the network again after 5 minutes or when `clear(example.getData)` is called.

## API

### @memoize(config)

Memoize the class method or getter below it.

#### Type: \[optional\] `Config`

```ts
interface Config {
	resolver?: (...args: any[]) => string | number;
	ttl?: number;
}
```

##### resolver \[optional\] function

Function to convert function arguments to a unique key.

Without a `resolver` function, the arguments are converted to a key with `json-stringify-safe`,
a save version of JSON stringify.
This works fine when the arguments are primitives like strings, numbers and booleans.
This is undesirable when passing in objects with irrelevant data, like DOM elements.
Use `resolver` to provide a function to calculate a unique key yourself.

Example:

```ts
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

```ts
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

```ts
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
