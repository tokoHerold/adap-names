import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
         super(delimiter);
        this.noComponents = this.splitAtNonControlCharacters(other, this.delimiter).length
        this.name = other;
    }

    public clone(): Name {
        return super.clone()
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString();
    }

    public toString(): string {
        return super.toString();
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        return this.splitAtNonControlCharacters(this.name, this.delimiter)[i];
    }

    public setComponent(i: number, c: string) {
        let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    public insert(i: number, c: string) {
        if (0 <= i && i < this.noComponents) {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components.splice(i, 0, c);
            this.name = components.join(this.delimiter);
            this.noComponents = components.length;
        } else if (i === this.noComponents) {
            this.append(c);
        }
    }

    public append(c: string) {
        this.name += this.delimiter + c;
        this.noComponents += 1;
    }

    public remove(i: number) {
        let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    public concat(other: Name): void {
        super.concat(other);
    }

    protected splitAtNonControlCharacters(s : string, delimiter : string) : string[] {
        let result : string[] = [];
        let lastSplitIndex = 0;
        for (let i = 0; i < s.length; i++) {
            let c = s.charAt(i);
            if (c === ESCAPE_CHARACTER) {
                // Found escape character - next one must be either delimiter or escape character
                if (i + 1 === s.length) throw new Error("Input was not correctly masked!")
                let c_next = s.charAt(i+1);
                if (c_next === ESCAPE_CHARACTER || c_next === delimiter) {
                    i += 1; // Skip next iteration
                } else {
                    throw new Error("Input was not correctly masked!");
                }
            }

            if (c === delimiter) {
                // Found delimiter - split string
                result.push(s.substring(lastSplitIndex, i)); // don't include delimiter
                lastSplitIndex = i + 1;
            }
        }
        result.push(s.substring(lastSplitIndex)); // Append remainder to split list
        return result;
    }
}