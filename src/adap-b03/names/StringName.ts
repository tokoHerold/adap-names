import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        if (other === undefined) throw new Error("Empty names are not permitted.");
        this.length = this.splitAtNonControlCharacters(other, this.delimiter).length
        this.name = other;
    }

    getNoComponents(): number {
        this.length = this.splitAtNonControlCharacters(this.name, this.delimiter).length; // name might change due to shallow copy
        return this.length;
    }

    getComponent(i: number): string {
        return this.splitAtNonControlCharacters(this.name, this.delimiter)[i];
    }

    setComponent(i: number, c: string) {
        if (0 <= i && i < this.length) {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components[i] = c;
            this.name = components.join(this.delimiter);
        }
    }

    insert(i: number, c: string) {
        if (0 <= i && i < this.length) {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components.splice(i, 0, c);
            this.name = components.join(this.delimiter);
            this.length = components.length;
        } else if (i === this.length) {
            this.append(c);
        }
    }

    append(c: string) {
        this.name += this.delimiter + c;
        this.length += 1;
    }

    remove(i: number) {
        if (0 <= i && i < this.length) {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components.splice(i, 1);
            this.name = components.join(this.delimiter);
            this.length = components.length;
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