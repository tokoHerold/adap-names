import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { StringName } from "./StringName";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertValidDelimiter(delimiter);
        this.doSetDelimiter(delimiter);
    }

    // May remain shallow, since object is immutable
    public clone(): Name {
        let copy = Object.create(this);

        this.assertClassInvariance();
        MethodFailedException.assert(this.isEqual(copy));
        return copy;
    }

    // Does not change state
    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter(delimiter);
        let result : string = this.getComponents()
            .map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER))
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.doGetDelimiter(), this.doGetDelimiter()))
            .join(delimiter); // Returns a new string object
        
        this.assertClassInvariance();
        if (this.getNoComponents() > 1) 
            MethodFailedException.assert(result !== "");
        MethodFailedException.assert(!result.includes("/"))
        return result;
    }

    // Does not change state
    public toString(): string {
        return this.asDataString();
    }

    // Does not change state
    public asDataString(): string {
        if (this.getDelimiterCharacter() !== DEFAULT_DELIMITER) {
            // Need to unmask control characters
            return this.getComponents()
                .map(c => c.replaceAll(ESCAPE_CHARACTER + this.doGetDelimiter(), this.doGetDelimiter()))
                .join(DEFAULT_DELIMITER); // returns a new string object
        }
        let result : string = this.getComponents().join(DEFAULT_DELIMITER);

        this.assertClassInvariance();

        this.assertDataSting(result);
        return result;
    }

    // Does not change state
    public isEqual(other: Name): boolean {
        IllegalArgumentException.assert(other != null && other != undefined);

        const otherDelimiter : string = other.getDelimiterCharacter();

        if (this === other) return true;
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) return false;
        let noComponents = this.getNoComponents();
        if (noComponents !== other.getNoComponents()) return false;
        for (let i = 0; i < noComponents; i++) {
            const otherComponent : string = other.getComponent(i);
            IllegalArgumentException.assert(this.isComponentCorrectlyMasked(otherComponent, otherDelimiter), "Name is not correctly masked!");
            if (this.getComponent(i) !== otherComponent) return false;
        }
        return true;

    }

    // Deos not change state
     public getHashCode(): number {
        let hashCode : number = this.doGetDelimiter().charCodeAt(0);
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

    // Does not change state
    public isEmpty(): boolean {
        let result : boolean = this.getNoComponents() === 0;
        this.assertClassInvariance();
        if (result) {
            try {
                this.getComponent(0);
                throw new MethodFailedException("Method failed");
            } catch (e) {
                MethodFailedException.assert(e instanceof IllegalArgumentException);
            }
        }
        return result;
    }

    // Does not change state
    public getDelimiterCharacter(): string {
        let delimiter = this.deepCopy<string>(this.doGetDelimiter());
        this.assertClassInvariance();
        MethodFailedException.assert(delimiter == this.doGetDelimiter(), "Method failed");
        try {
            this.assertValidDelimiter(delimiter);
        } catch {
            throw new MethodFailedException("Method failed");
        }
        return delimiter;
    }

    // Does not change state
    public getNoComponents(): number {
        this.assertClassInvariance(); 
        return this.doGetNoComponents(); // a number is call-by-value
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);

        let component : string = this.deepCopy<string>(this.doGetComponent(i));

        this.assertClassInvariance();

        MethodFailedException.assert(this.isComponentCorrectlyMasked(component));
        return component;
    } 

    public setComponent(i: number, c: string) : Name {
        this.assertValidIndex(i);
        this.assertisProperlyMasked(c);

        const result = this.deepCopy(this);
        const before = this.deepCopy(this);
        result.doSetComponent(i, c);
            
        this.assertClassInvariance(before); // assert this object did not change
        result.assertClassInvariance(); // assert other object's class invariants
        MethodFailedException.assert(result.getComponent(i) === c);
        return result;
    }
    
    public insert(i: number, c: string) : Name {
        this.assertValidIndex(i, true);
        this.assertisProperlyMasked(c);

        const oldNo : number = this.getNoComponents();
        const result = this.deepCopy(this);
        const before = this.deepCopy(this);
        result.doInsert(i, c);
        
        this.assertClassInvariance(before);
        result.assertClassInvariance(); // assert other object's class invariants
        MethodFailedException.assert(result.getNoComponents() === oldNo + 1);
        return result;
    }

    public append(c: string): Name {
        this.assertisProperlyMasked(c);

        const oldNo: number = this.getNoComponents();
        const result = this.deepCopy(this);
        const before = this.deepCopy(this);

        result.doAppend(c);

        this.assertClassInvariance(before);
        result.assertClassInvariance(); // assert other object's class invariants
        MethodFailedException.assert(result.getNoComponents() === oldNo + 1);
        return result;
    }

    public remove(i: number): Name {
        this.assertValidIndex(i);

        const oldNo: number = this.getNoComponents();
        const result = this.deepCopy(this);
        const before = this.deepCopy(this);

        result.doRemove(i);

        this.assertClassInvariance(before);
        result.assertClassInvariance(); // assert other object's class invariants
        MethodFailedException.assert(result.getNoComponents() === oldNo - 1);
        return result;
    }

    public concat(other: Name): Name {
        IllegalArgumentException.assert(other != null && other != undefined);
        IllegalArgumentException.assert(other.getDelimiterCharacter() == this.doGetDelimiter(), "Delimiters did not match!");
        
        let expectedNoComponents = this.getNoComponents() + other.getNoComponents();
        const result = this.deepCopy(this);
        const before = this.deepCopy(this);

        for (let i = 0; i < other.getNoComponents(); i++) {
            const otherComponent = other.getComponent(i);
            IllegalArgumentException.assert(this.isComponentCorrectlyMasked(otherComponent, other.getDelimiterCharacter()), "Passed name is not valid!");
            result.doAppend(other.getComponent(i));
        }

        this.assertClassInvariance(before);
        result.assertClassInvariance();
        MethodFailedException.assert(result.getNoComponents() === expectedNoComponents, "Method failed.");
        return result;
    }

    protected abstract doGetNoComponents(): number;

    protected abstract doGetComponent(i: number): string;
    protected abstract doSetComponent(i: number, c: string): void;

    protected abstract doInsert(i: number, c: string): void;
    protected abstract doAppend(c: string): void;
    protected abstract doRemove(i: number): void;


    protected doSetDelimiter(delimiter : string) {
        this.delimiter = delimiter;
    }

    protected doGetDelimiter() : string {
        return this.delimiter;
    }

    protected assertValidDelimiter(c : string) {
        IllegalArgumentException.assert(c != null && c != undefined);
        IllegalArgumentException.assert(typeof c === "string", "Delimiter must be a string");
        IllegalArgumentException.assert(c.length === 1, "Delimiter must be exactly one character");
        IllegalArgumentException.assert(c !== ESCAPE_CHARACTER, "Delimiter cannot be the escape character!");
    }

    protected assertDataSting(s : string) : void {
        try {
            let name = new StringName(s, DEFAULT_DELIMITER);
            MethodFailedException.assert(name.getNoComponents() === this.getNoComponents(), "Data String corrupt");
        } catch {
            throw new MethodFailedException("Data String corrupt");
        }
    }

    protected assertValidIndex(i : number, inclusive : boolean = false) {
        IllegalArgumentException.assert(i != null && i != undefined);
        IllegalArgumentException.assert(inclusive || (i >= 0 && i < this.getNoComponents()));
        IllegalArgumentException.assert(!inclusive || (i >= 0 && i <= this.getNoComponents()));
        IllegalArgumentException.assert(Number.isInteger(i));
    }

    protected assertisProperlyMasked(c : string) {
        IllegalArgumentException.assert(c != null && c != undefined);
        IllegalArgumentException.assert(this.isComponentCorrectlyMasked(c, this.doGetDelimiter()));
    }

    protected getComponents() : string[] {
        let components : string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));

        }
        return components;
    }

    
    protected deepCopy<T>(element : T) : T {
        let copy : T = structuredClone(element);
        Object.setPrototypeOf(copy, Object.getPrototypeOf(element));
        return copy;
    }
    
    
    protected isComponentCorrectlyMasked(component : string, delimiter : string = this.doGetDelimiter()) : boolean {
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
    
    protected isCorrectlyMasked(n : AbstractName) : boolean {
        for (let i = 0; i < n.doGetNoComponents(); i++) {
            if (!this.isComponentCorrectlyMasked(n.getComponent(i), n.getDelimiterCharacter())) {
                return false;
            }
        } 
        return true;
    }
    
    protected assertClassInvariance(before? : AbstractName) : void {
        if (before != undefined) {
            InvalidStateException.assert(this.isEqual(before));   
        }
    }
}