import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source != null && source != undefined);
        super(delimiter);

        try {
            this.doSetNoComponents(this.splitAtNonControlCharacters(source, this.doGetDelimiter()).length);
        } catch {
            throw new IllegalArgumentException("Input was not correctly masked!");
        }
        this.doSetName(source);
        this.assertClassInvariance();
    }


    protected doGetNoComponents(): number {
        return this.noComponents;
    }

    protected doGetComponent(i: number): string {
        let components : string[] = this.splitAtNonControlCharacters(this.doGetName(), this.doGetDelimiter());
        return components[i];
    }

    protected doSetComponent(i: number, c: string) {
        let components : string[] = this.splitAtNonControlCharacters(this.doGetName(), this.doGetDelimiter());
        components[i] = c;
        this.doSetName(components.join(this.doGetDelimiter()));
    }

    protected doInsert(i: number, c: string) {
        if (i === this.doGetNoComponents()) {
            this.append(c);
        } else {
            let components : string[] = this.splitAtNonControlCharacters(this.doGetName(), this.doGetDelimiter());
            components.splice(i, 0, c);
            this.doSetName(components.join(this.doGetDelimiter()));
            this.doSetNoComponents(components.length);
        }
    }

    protected doAppend(c: string) {
        this.doSetName(this.doGetName() + this.doGetDelimiter() + c);
        this.doSetNoComponents(this.doGetNoComponents() + 1);
    }

    protected doRemove(i: number) {
        let components : string[] = this.splitAtNonControlCharacters(this.doGetName(), this.doGetDelimiter());
        components.splice(i, 1);
        this.doSetName(components.join(this.doGetDelimiter()));
        this.doSetNoComponents(components.length);
    }

    protected doSetName(name : string) : void {
        this.name = name;
    }

    protected doGetName() : string {
        return this.name;
    }

    protected doSetNoComponents(noComponents : number) : void {
        this.noComponents = noComponents;
    }
    
    protected tryMethodOrRollback(f : Function) : void {
        let copy : StringName = this.deepCopy() as StringName;
        try {
           f(); 
        } catch (e) {
            this.doSetName(copy.doGetName()); // Restore state
            this.doSetNoComponents(copy.doGetNoComponents());
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
        let components : string[] = this.splitAtNonControlCharacters(this.doGetName(), this.doGetDelimiter());
        for (let c of components) {
            InvalidStateException.assert(this.isComponentCorrectlyMasked(c), "Class invariant not met!");
        }
        InvalidStateException.assert(components.length === this.noComponents, "Class invariant not met")
    }
}