import { memoize } from "../";

interface IObject {
	id: number;
	irrelevant: string;
}

class Example {
	a: number;

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
}

let example;

beforeEach(() => {
	example = new Example();
});

it("Test function call", () => {
	example.a = 10;
	expect(example.getProjects(20, "south")).toEqual(
		'getProjects(20, "south"); a=10'
	);
});

it("Test memoize", () => {
	example.a = 10;
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
	example.a++;
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
	example.a++;
	expect(example.getA(20, "south")).toEqual('getA(20, "south"); a=10');
	example.a++;
	expect(example.getA(21, "south")).toEqual('getA(21, "south"); a=13');
});

it("Test getter", () => {
	example.a = 10;
	expect(example.aa).toEqual('get a; a=10');
	example.a++;
	expect(example.aa).toEqual('get a; a=10');
});

it("Test objectId", () => {
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
