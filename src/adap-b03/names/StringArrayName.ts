import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        if (other.length === 0) throw new Error("Emtpy names are not permitted!")
            other.forEach(element => {
                this.components.push(element);
        });
    }

    getNoComponents(): number {
        return this.components.length;
    }

    getComponent(i: number): string {
        return this.components[i];
    }

    setComponent(i: number, c: string) {
        if (i >= 0 && i < this.components.length)
            this.components[i] = c;
    }

    insert(i: number, c: string) {
        if (i >= 0 && i < this.components.length)
            this.components.splice(i, 0, c);
        else if (i === this.components.length)
            this.append(c);
    }

    append(c: string) {
        this.components.push(c);
    }
    remove(i: number) {
        if (i >= 0 && i < this.components.length)
            this.components.splice(i, 1);
    }
}