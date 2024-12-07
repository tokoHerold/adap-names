import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        IllegalArgumentException.assert(other != null && other != undefined);
        super(delimiter);
        try {
            this.noComponents = this.splitAtNonControlCharacters(other, this.delimiter).length
        } catch {
            throw new IllegalArgumentException("Input was not correctly masked!");
        }
        this.name = other;
        MethodFailedException.assert(AbstractName.isCorrectlyMasked(this), "Method failed");
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
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertClassInvariance();
        IllegalArgumentException.assert(i != null && i != undefined);
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Illegal index!");
        return this.splitAtNonControlCharacters(this.name, this.delimiter)[i];
    }

    public setComponent(i: number, c: string) {
        this.assertClassInvariance();
        IllegalArgumentException.assert( i != null && i != undefined);(i);
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Illegal index!");
        IllegalArgumentException.assert( c != null && c != undefined);
        IllegalArgumentException.assert(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.tryMethodOrRestore(() => {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components[i] = c;
            this.name = components.join(this.delimiter);
            MethodFailedException.assert(this.getComponent(i) === c, "Method failed.");
        });
        this.assertClassInvariance();
    }

    public insert(i: number, c: string) {
        this.assertClassInvariance();
        IllegalArgumentException.assert(i != null && i != undefined);
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "Illegal index!");
        IllegalArgumentException.assert(c != null && c != undefined);
        IllegalArgumentException.assert(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.tryMethodOrRestore(() => {
            let noComponents = this.noComponents;
            if (0 <= i && i < this.noComponents) {
                let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
                components.splice(i, 0, c);
                this.name = components.join(this.delimiter);
                this.noComponents = components.length;
            } else if (i === this.noComponents) {
                this.append(c);
            }
            MethodFailedException.assert(this.noComponents === noComponents + 1, "Method failed");
            MethodFailedException.assert(this.getComponent(i) === c, "MethodFailed");
        });
        this.assertClassInvariance();
    }

    public append(c: string) {
        this.assertClassInvariance();
        IllegalArgumentException.assert(c != null && c != undefined);
        IllegalArgumentException.assert(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.tryMethodOrRestore(() => {
            let oldLen : number = this.name.length;
            this.name += this.delimiter + c;
            this.noComponents += 1;
            MethodFailedException.assert(this.name.length === oldLen + c.length + 1, "Method failed")
        });
        this.assertClassInvariance();
    }

    public remove(i: number) {
        this.assertClassInvariance();
        IllegalArgumentException.assert(i != null && i != undefined);
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, "Illegal index!");
        this.tryMethodOrRestore(() => {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            let oldLen : number = this.name.length;
            let len : number = components[i].length;
            components.splice(i, 1);
            this.name = components.join(this.delimiter);
            this.noComponents = components.length;
            MethodFailedException.assert(this.name.length <= oldLen - len && this.name.length >= oldLen - len - 1, "Method failed");
        });
        this.assertClassInvariance();
    }

    public concat(other: Name): void {
       this.assertClassInvariance();
       this.tryMethodOrRestore(() => super.concat(other)); 
       this.assertClassInvariance();
    }
    
    protected tryMethodOrRestore(f : Function) : void {
        let copy : StringName = this.deepCopy() as StringName;
        try {
           f(); 
        } catch (e) {
            if (e instanceof MethodFailedException) {
                this.name = copy.name; // Restore state
                this.noComponents = copy.noComponents;
            }
            throw e;
        }
    }

    protected splitAtNonControlCharacters(s : string, delimiter : string) : string[] {
        let result : string[] = [];
        let lastSplitIndex = 0;
        for (let i = 0; i < s.length; i++) {
            let c = s.charAt(i);
            if (c === ESCAPE_CHARACTER) {
                // Found escape character - next one must be either delimiter or escape character
                InvalidStateException.assert(i + 1 !== s.length, "Name is not correctly masked!");
                let c_next = s.charAt(i+1);
                if (c_next === ESCAPE_CHARACTER || c_next === delimiter) {
                    i += 1; // Skip next iteration
                } else {
                    throw new InvalidStateException("Name is not correctly masked!")
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

    protected assertClassInvariance(): void {
        try {
            this.assertValidDelimiter(this.delimiter);
        } catch (e) {
            if (e instanceof IllegalArgumentException) throw new InvalidStateException("Class invariant not met!");
            throw e;
        }
        let components : string[] = this.splitAtNonControlCharacters(this.name, this.delimiter);
        for (let c of components) {
            InvalidStateException.assert(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Class invariant not met!");
        }
        InvalidStateException.assert(components.length === this.noComponents, "Class invariant not met")
    }
}