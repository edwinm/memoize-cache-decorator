import { memoize } from "../memoize";

class Example {
	a: number;

	constructor() {
		this.a = 10;
	}

	@memoize()
	getProjects(id: number, direction: string) {
		return `getProjects(${id}, "${direction}"); a=${this.a}`;
	}

	@memoize()
	getA(id: number, direction: string) {
		return `getA(${id}, "${direction}"); a=${this.a}`;
	}
}

let example;

beforeEach(() => {
	example = new Example();
});

it("Test function call", () => {
	expect(example.getProjects(20, "south")).toEqual(
		'getProjects(20, "south"); a=10'
	);
});

it("Test memoize", () => {
	expect(example.getA(20, "south")).toEqual(
		'getA(20, "south"); a=10'
	);
	example.a++;
	expect(example.getA(20, "south")).toEqual(
		'getA(20, "south"); a=10'
	);
	example.a++;
	expect(example.getA(20, "south")).toEqual(
			'getA(20, "south"); a=10'
	);
	example.a++;
	expect(example.getA(21, "south")).toEqual(
		'getA(21, "south"); a=13'
	);
});
