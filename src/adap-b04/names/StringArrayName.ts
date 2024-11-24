import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(other);
        super(delimiter);
        // super must be called before this.isCorrectlyMasked can be called, otherwise typescript will not compile
        IllegalArgumentException.assertCondition(this.isCorrectlyMasked(other), "Components are not correctly masked")
        other.forEach(e => this.components.push(e));
    }

    public clone(): Name {
        return super.clone()
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
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
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.components.length, "Illegal index!");
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.components.length, "Illegal index!");
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i <= this.components.length, "Illegal index!");
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");

        if (i >= 0 && i < this.components.length)
            this.components.splice(i, 0, c);
        else if (i === this.components.length)
            this.append(c);
    }

    public append(c: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.components.push(c);
    }

    public remove(i: number) {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.components.length, "Illegal index!");
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(other);
        IllegalArgumentException.assertCondition(other.getDelimiterCharacter() == this.delimiter, "Delimiters did not match!");
        IllegalArgumentException.assertCondition(AbstractName.isCorrectlyMasked(other), "Passed name is not valid!");
        super.concat(other);
    }



    protected isCorrectlyMasked(components : string[] = this.components) : boolean {
        for (let c of components) {
            if (c === null || c === undefined) return false;
            if (!(typeof c === "string")) return false;
            if (!AbstractName.isComponentCorrectlyMasked(c, this.delimiter)) return false;
        }
        return true;
    }


}