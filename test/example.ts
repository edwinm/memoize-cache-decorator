import { memoize } from "../";

class Example {
	@memoize()
	myFunction() {
		return Math.random();
	}
}

const example = new Example();

console.log(example.myFunction());
console.log(example.myFunction());
console.log(example.myFunction());
