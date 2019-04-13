import { memoize } from "./memoize";

class Example {
    a: number;

    constructor() {
        this.a = 10;
    }

    @memoize()
    getProjects(id: number, direction: string) {
        console.log("fn called");
        return `Getting project ${this.a} ${id}`;
    }
}

const example = new Example();

console.log(example.getProjects(20, "south"));
console.log(example.getProjects(20, "south"));
console.log(example.getProjects(21, "north"));
