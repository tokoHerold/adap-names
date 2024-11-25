import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(other);
        super(delimiter);
        try {
            this.noComponents = this.splitAtNonControlCharacters(other, this.delimiter).length
        } catch {
            throw new IllegalArgumentException("Input was not correctly masked!");
        }
        this.name = other;
        MethodFailureException.assertCondition(AbstractName.isCorrectlyMasked(this), "Method failed");
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
        return this.noComponents;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.noComponents, "Illegal index!");
        return this.splitAtNonControlCharacters(this.name, this.delimiter)[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.noComponents, "Illegal index!");
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.tryMethodOrRestore(() => {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            components[i] = c;
            this.name = components.join(this.delimiter);
            MethodFailureException.assertCondition(this.getComponent(i) === c, "Method failed.");
        });
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i <= this.noComponents, "Illegal index!");
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
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
            MethodFailureException.assertCondition(this.noComponents === noComponents + 1, "Method failed");
            MethodFailureException.assertCondition(this.getComponent(i) === c, "MethodFailed");
        })
        
    }

    public append(c: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(AbstractName.isComponentCorrectlyMasked(c, this.delimiter), "Component is not correctly masked!");
        this.tryMethodOrRestore(() => {
            let oldLen : number = this.name.length;
            this.name += this.delimiter + c;
            this.noComponents += 1;
            MethodFailureException.assertCondition(this.name.length === oldLen + c.length + 1, "Method failed")
        })
    }

    public remove(i: number) {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(i >= 0 && i < this.noComponents, "Illegal index!");
        this.tryMethodOrRestore(() => {
            let components = this.splitAtNonControlCharacters(this.name, this.delimiter);
            let oldLen : number = this.name.length;
            let len : number = components[i].length;
            components.splice(i, 1);
            this.name = components.join(this.delimiter);
            this.noComponents = components.length;
            MethodFailureException.assertCondition(this.name.length <= oldLen - len && this.name.length >= oldLen - len - 1, "Method failed");
        });
    }

    public concat(other: Name): void {
       this.tryMethodOrRestore(() => super.concat(other)); 
    }
    
    protected tryMethodOrRestore(f : Function) : void {
        let copy : StringName = this.deepCopy() as StringName;
        try {
           f(); 
        } catch (e) {
            if (e instanceof MethodFailureException) {
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
                InvalidStateException.assertCondition(i + 1 !== s.length, "Name is not correctly masked!");
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
}