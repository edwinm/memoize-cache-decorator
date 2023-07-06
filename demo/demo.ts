import { memoize } from "../dist/memoize.js";

class Demo {
	@memoize()
	myFunction() {
		return Math.random();
	}
}

const example = new Demo();

console.log(example.myFunction());
console.log(example.myFunction());
console.log(example.myFunction());
