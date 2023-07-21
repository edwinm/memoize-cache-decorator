import { memoize, clear } from "../";

interface IObject {
	id: number;
	irrelevant: string;
}

class Example {
	a: number;
	static s: number;

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

	@memoize({ resolver: (el: IObject) => el.id })
	setElement(el: IObject) {
		return `setElement(el); el.id=${el.id}; el.irrelevant=${el.irrelevant}`;
	}

	@memoize()
	get aa() {
		return `get a; a=${this.a}`;
	}

	@memoize({ ttl: 40 })
	expiring40() {
		return `a=${this.a}`;
	}

	@memoize({ ttl: 60 })
	expiring60() {
		return `a=${this.a}`;
	}

	@memoize({ ttl: 40 })
	expiringArg(str: string) {
		return `arg=${this.a}-${str}`;
	}

	@memoize({ ttl: 30 })
	expiring30() {
		return `a=${this.a}`;
	}

	@memoize({ ttl: 30 })
	expiring30Arg(str: string) {
		return `arg=${this.a}-${str}`;
	}

	@memoize({ ttl: 30 })
	async expiring20Async() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(`a=${this.a}`);
			}, 5);
		});
	}

	@memoize({ ttl: 30 })
	static expiring30Static(str: string) {
		return `arg=${this.s}-${str}`;
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
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
	example.a++;
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
	example.a++;
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
	example.a++;
	expect(example.getA(21, "south")).toEqual('getA(21, "south"); a=13');
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
});

it("Test getter", () => {
	expect(example.aa).toEqual("get a; a=10");
	example.a++;
	expect(example.aa).toEqual("get a; a=10");
});

it("Test resolver", () => {
	let div: IObject;
	div = { id: 20, irrelevant: "Shinano" };
	expect(example.setElement(div)).toEqual(
		"setElement(el); el.id=20; el.irrelevant=Shinano"
	);
	div = { id: 20, irrelevant: "Tone" };
	expect(example.setElement(div)).toEqual(
		"setElement(el); el.id=20; el.irrelevant=Shinano"
	);
	div = { id: 20, irrelevant: "Ishikari" };
	expect(example.setElement(div)).toEqual(
		"setElement(el); el.id=20; el.irrelevant=Shinano"
	);
	div = { id: 21, irrelevant: "Teshio" };
	expect(example.setElement(div)).toEqual(
		"setElement(el); el.id=21; el.irrelevant=Teshio"
	);
});

it("Test ttl", async () => {
	expect(example.expiring40()).toEqual("a=10");
	expect(example.expiring60()).toEqual("a=10");
	example.a++;
	expect(example.expiring40()).toEqual("a=10");
	expect(example.expiring60()).toEqual("a=10");
	await new Promise((resolve) => setTimeout(resolve, 20));
	example.a++;
	expect(example.expiring40()).toEqual("a=10");
	expect(example.expiring60()).toEqual("a=10");
	example.a++;
	expect(example.expiring40()).toEqual("a=10");
	expect(example.expiring60()).toEqual("a=10");
	await new Promise((resolve) => setTimeout(resolve, 30));
	example.a++;
	expect(example.expiring40()).toEqual("a=14");
	expect(example.expiring60()).toEqual("a=10");
	example.a++;
	expect(example.expiring40()).toEqual("a=14");
	expect(example.expiring60()).toEqual("a=10");
	await new Promise((resolve) => setTimeout(resolve, 20));
	expect(example.expiring40()).toEqual("a=14");
	expect(example.expiring60()).toEqual("a=15");
});

it("Test ttl with args", async () => {
	expect(example.expiringArg("a")).toEqual("arg=10-a");
	example.a++;
	await new Promise((resolve) => setTimeout(resolve, 20));
	expect(example.expiringArg("a")).toEqual("arg=10-a");
	expect(example.expiringArg("b")).toEqual("arg=11-b");
	example.a++;
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(example.expiringArg("a")).toEqual("arg=10-a");
	expect(example.expiringArg("b")).toEqual("arg=11-b");
	example.a++;
	await new Promise((resolve) => setTimeout(resolve, 20));
	expect(example.expiringArg("a")).toEqual("arg=13-a");
	expect(example.expiringArg("b")).toEqual("arg=11-b");
	example.a++;
	await new Promise((resolve) => setTimeout(resolve, 20));
	expect(example.expiringArg("a")).toEqual("arg=13-a");
	expect(example.expiringArg("b")).toEqual("arg=14-b");
});

it("Test ttl with two instances", async () => {
	const example2 = new Example();
	expect(example.expiring40()).toEqual("a=10");
	example.a++;
	example2.a++;
	await new Promise((resolve) => setTimeout(resolve, 30));
	expect(example.expiring40()).toEqual("a=10");
	expect(example2.expiring40()).toEqual("a=11");
	example.a++;
	example2.a++;
	await new Promise((resolve) => setTimeout(resolve, 20));
	expect(example.expiring40()).toEqual("a=12");
	expect(example2.expiring40()).toEqual("a=11");
});

it("Test ttl with aync function", async () => {
	const result1 = await example.expiring20Async();
	expect(result1).toEqual("a=10");
	example.a++;
	await new Promise((resolve) => setTimeout(resolve, 10));
	// Cache is not expired and should return old value
	const result2 = await example.expiring20Async();
	expect(result2).toEqual("a=10");
	example.a++;
	await new Promise((resolve) => setTimeout(resolve, 30));
	// Now cache is expired and should return new value
	const result3 = await example.expiring20Async();
	expect(result3).toEqual("a=12");
});

it("Test ttl with static function", async () => {
	Example.s = 0;
	expect(Example.expiring30Static("10")).toEqual("arg=0-10");
	Example.s++;
	await new Promise((resolve) => setTimeout(resolve, 10));
	// Cache is not expired and should return old value
	expect(Example.expiring30Static("10")).toEqual("arg=0-10");
	Example.s++;
	await new Promise((resolve) => setTimeout(resolve, 30));
	// Now cache is expired and should return new value
	expect(Example.expiring30Static("10")).toEqual("arg=2-10");
});

it("Test clear", () => {
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
	example.a++;
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
	example.a++;
	clear(example.getA);
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=12');
	example.a++;
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=12');
});
