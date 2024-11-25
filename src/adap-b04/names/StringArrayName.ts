import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../../adap-b05/common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(other);
        super(delimiter);
        // super must be called before this.isCorrectlyMasked can be called, otherwise typescript will not compile
        IllegalArgumentException.assertCondition(this.isCorrectlyMasked(other), "Components are not correctly masked")
        other.forEach(e => this.components.push(e));
        MethodFailedException.assertCondition(AbstractName.isCorrectlyMasked(this), "Method failed.");
        this.assertClassInvariance();
    }

    public clone(): Name {
        this.assertClassInvariance();
        return super.clone()
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertClassInvariance();
        return super.asString(delimiter);
    }

    public toString(): string {
        this.assertClassInvariance();
        return super.toString();
    }

    public asDataString(): string {
        this.assertClassInvariance();
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        this.assertClassInvariance();
        return super.isEqual(other);
    }

    public getHashCode(): number {
        this.assertClassInvariance();
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        this.assertClassInvariance();
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariance();
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        this.assertClassInvariance();
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertClassInvariance();
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.components.length, "Illegal index!");
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertClassInvariance();
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.components.length, "Illegal index!");
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.tryMethod(() => {
            this.components[i] = c;
            MethodFailedException.assertCondition(this.components[i] === c, "Method failed");
        })
        this.assertClassInvariance();
    }

    public insert(i: number, c: string) {
        this.assertClassInvariance();
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i <= this.components.length, "Illegal index!");
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");

        this.tryMethod(() => {
            if (i >= 0 && i < this.components.length)
                this.components.splice(i, 0, c);
            else if (i === this.components.length)
                this.append(c);
            MethodFailedException.assertCondition(this.components[i] === c, "Method failed.");
        });
        this.assertClassInvariance();
    }

    public append(c: string) {
        this.assertClassInvariance();
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.tryMethod(() => {
            this.components.push(c);
            MethodFailedException.assertCondition(this.components[this.components.length - 1] === c, "Method failed.");  
        })
        this.assertClassInvariance();
    }

    public remove(i: number) {
        this.assertClassInvariance();
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.components.length, "Illegal index!");
        this.tryMethod(() => {
            let count : number = this.components.length;
            this.components.splice(i, 1);
            MethodFailedException.assertCondition(this.components.length === count - 1, "Method failed");
        })
        this.assertClassInvariance();
    }

    public concat(other: Name): void {
       this.assertClassInvariance();
       this.tryMethod(() => super.concat(other)); 
       this.assertClassInvariance();
    }

    protected tryMethod(f : Function) : void {
        let copy : StringArrayName = this.deepCopy() as StringArrayName;
        try {
           f(); 
        } catch (e) {
            if (e instanceof MethodFailedException) {
                this.components = copy.components; // Restore state
            }
            throw e;
        }
    }



    protected isCorrectlyMasked(components : string[] = this.components) : boolean {
        for (let c of components) {
            if (c === null || c === undefined) return false;
            if (!(typeof c === "string")) return false;
            if (!AbstractName.isComponentCorrectlyMasked(c, this.delimiter)) return false;
        }
        return true;
    }

    protected assertClassInvariance(): void {
        try {
            this.assertValidDelimiter(this.delimiter);
        } catch (e) {
            if (e instanceof IllegalArgumentException) throw new InvalidStateException("Class invariant not met!");
            throw e;
        }
        InvalidStateException.assertCondition(this.isCorrectlyMasked(), "Class invariant not met!");
    }


}