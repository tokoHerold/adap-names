import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.getComponents()
            .map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER))
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
            .join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        return this.getComponents().join(this.delimiter);

    }

    public isEqual(other: Name): boolean {
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) return false;
        let noComponents = this.getNoComponents();
        if (noComponents !== other.getNoComponents()) return false;
        for (let i = 0; i < noComponents; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode : number = this.delimiter.charCodeAt(0);
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    // https://en.wikipedia.org/wiki/Object_copying#Shallow_copy
    // Shallow copy must access the fields of the object
    public clone(): Name {
        // https://medium.com/@sandeep.h.hullatti/javascript-9-ways-to-shallow-copy-2bc2a866f4db
        return Object.create(this)
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    protected getComponents() : string[] {
        let components : string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));

        }
        return components;
    }

}