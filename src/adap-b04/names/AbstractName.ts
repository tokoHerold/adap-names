import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter !== undefined) {
            IllegalArgumentException.assertIsNotNullOrUndefined(delimiter);
            this.assertValidDelimiter(delimiter);
            this.delimiter = delimiter;
        }
    }

    public clone(): Name {
        return Object.create(this)
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assertIsNotNullOrUndefined(delimiter);
        this.assertValidDelimiter(delimiter);
        return this.getComponents()
            .map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER))
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter))
            .join(delimiter);
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
        return this.getComponents().join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assertIsNotNullOrUndefined(other);
        IllegalArgumentException.assertCondition(AbstractName.isCorrectlyMasked(other), "Name is not correctly masked")
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
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    } 
    
    protected getComponents() : string[] {
        let components : string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));

        }
        return components;
    }

    protected assertValidDelimiter(c : string) {
        IllegalArgumentException.assertCondition(typeof c === "string", "Delimiter must be a string");
        IllegalArgumentException.assertCondition(c.length === 1, "Delimiter must be exactly one character");
        IllegalArgumentException.assertCondition(c !== ESCAPE_CHARACTER, "Delimiter cannot be the escape character!");
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


}