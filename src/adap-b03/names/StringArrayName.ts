import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        if (source.length === 0) throw new Error("Emtpy names are not permitted!")
            source.forEach(element => {
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