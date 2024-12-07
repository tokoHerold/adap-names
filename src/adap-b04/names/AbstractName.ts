import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { StringName } from "./StringName";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined) {
            IllegalArgumentException.assert(delimiter != null && delimiter != undefined);
            this.assertValidDelimiter(delimiter);
            this.delimiter = delimiter;
        }
    }

    public clone(): Name {
        return Object.create(this)
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter != null && delimiter != undefined);
        this.assertValidDelimiter(delimiter);
        let result : string = this.getComponents()
            .map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER))
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
            .join(delimiter);
        
        if (this.getNoComponents() > 1) 
            MethodFailedException.assert(result !== "", "Method failed.");
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        if (this.getDelimiterCharacter() !== DEFAULT_DELIMITER) {
            // Need to unmask control characters
            return this.getComponents()
                .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
                .join(DEFAULT_DELIMITER);
        }
        let result : string = this.getComponents().join(DEFAULT_DELIMITER);
        this.assertDataSting(result);
        return result;
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other != null && other != undefined);
        IllegalArgumentException.assert(AbstractName.isCorrectlyMasked(other), "Name is not correctly masked")
        if (this === other) return true;
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) return false;
        let noComponents = this.getNoComponents();
        if (noComponents !== other.getNoComponents()) return false;
        for (let i = 0; i < noComponents; i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode : number = this.delimiter.charCodeAt(0);
        const components: string[] = this.getComponents();
        for (let s of components) {
            for (let i = 0; i < s.length; i++) {
                let c = s.charCodeAt(i);
                hashCode = (hashCode << 5) - hashCode + c;
                hashCode |= 0;
            }
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        let result : boolean = this.getNoComponents() === 0;
        if (result === true) {
            MethodFailedException.assert(this.asDataString() === "", "Method failed.");
        } else {
            MethodFailedException.assert(this.asDataString().length > 0, "Method failed.");
        }
        return result;
    }

    public getDelimiterCharacter(): string {
        let delimiter = this.delimiter;
        MethodFailedException.assert(delimiter == this.delimiter, "Method failed");
        return delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assert(other != null && other != undefined);
        IllegalArgumentException.assert(other.getDelimiterCharacter() == this.delimiter, "Delimiters did not match!");
        IllegalArgumentException.assert(AbstractName.isCorrectlyMasked(other), "Passed name is not valid!");
        let noComponents = this.getNoComponents() + other.getNoComponents();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        MethodFailedException.assert(this.getNoComponents() === noComponents, "Method failed.");
    }
    
    protected getComponents() : string[] {
        let components : string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));

        }
        return components;
    }

    protected deepCopy() : AbstractName {
        let copy : Object = structuredClone(this);
        Object.setPrototypeOf(copy, Object.getPrototypeOf(this));
        return copy as AbstractName;
    }

    protected assertValidDelimiter(c : string) {
        IllegalArgumentException.assert(typeof c === "string", "Delimiter must be a string");
        IllegalArgumentException.assert(c.length === 1, "Delimiter must be exactly one character");
        IllegalArgumentException.assert(c !== ESCAPE_CHARACTER, "Delimiter cannot be the escape character!");
    }

    protected static isComponentCorrectlyMasked(component : string, delimiter : string) : boolean {
        for (let i = 0; i < component.length; i++) {
            let c = component.charAt(i);
            if (c === ESCAPE_CHARACTER) {
                // Found escape character - next one must be either delimiter or escape character
                if (i + 1 === component.length) return false;
                let c_next = component.charAt(i+1);
                if (c_next === ESCAPE_CHARACTER || c_next === delimiter) {
                    i += 1; // Skip next iteration
                } else {
                    return false;
                }
            } else if (c === delimiter) {
                return false;
            }
        }
        return true;
    }

    protected static isCorrectlyMasked(n : Name) : boolean {
       for (let i = 0; i < n.getNoComponents(); i++) {
            if (!this.isComponentCorrectlyMasked(n.getComponent(i), n.getDelimiterCharacter())) {
                return false;
            }
       } 
       return true;
    }

    protected assertDataSting(s : string) : void {
        try {
            let name = new StringName(s, DEFAULT_DELIMITER);
            MethodFailedException.assert(name.getNoComponents() === this.getNoComponents(), "Data String corrupt");
        } catch {
            throw new MethodFailedException("Data String corrupt");
        }
    } 

    protected abstract assertClassInvariance() : void;

}