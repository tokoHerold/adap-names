import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        if (other === undefined) throw new Error("Empty names are not permitted.");
        this.length = this.splitAtNonControlCharacters(other, this.delimiter).length
        this.name = other;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.splitAtNonControlCharacters(this.name, this.delimiter)
        .map(s => s.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER)) // Replace escape characters
        .map(s => s.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter)) // Replace delimiters
        .join(delimiter);
    }

    public asDataString(): string {
        return this.splitAtNonControlCharacters(this.name, this.delimiter).join(DEFAULT_DELIMITER);
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.length;
    }

    public getComponent(x: number): string {
        return this.splitAtNonControlCharacters(this.name, this.delimiter)[x];
    }

    public setComponent(n: number, c: string): void {
        if (0 <= n && n < this.length) {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components[n] = c;
            this.name = components.join(this.delimiter);
        }
    }

    public insert(n: number, c: string): void {
        if (0 <= n && n < this.length) {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components.splice(n, 0, c);
            this.name = components.join(this.delimiter);
            this.length = components.length;
        } else if (n === this.length) {
            this.append(c);
        }
    }

    public append(c: string): void {
        this.name += this.delimiter + c;
        this.length += 1;
    }

    public remove(n: number): void {
        if (0 <= n && n < this.length) {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components.splice(n, 1);
            this.name = components.join(this.delimiter);
            this.length = components.length;
        }
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
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