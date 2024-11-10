import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (other.length === 0) throw new Error("Emtpy names are not permitted!")
        other.forEach(element => {
            this.components.push(element);
        });
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components
        .map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER)) // Replace escape characters
        .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)) // Replace control characters
        .join(delimiter);
    }

    public asDataString(): string {
        if (this.delimiter !== DEFAULT_DELIMITER) {
            // Edge case: if default delimiter is not equal to this.delimiter
            return this.components
                .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
                .join(DEFAULT_DELIMITER);
        }
        return this.components.join(DEFAULT_DELIMITER);
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i >= 0 && i < this.components.length)
            this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i >= 0 && i < this.components.length)
            this.components.splice(i, 0, c);
        else if (i === this.components.length)
            this.append(c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i >= 0 && i < this.components.length)
            this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }
}