import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { StringName } from "./StringName";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertValidDelimiter(delimiter);
        this.doSetDelimiter(delimiter);
    }

    public clone(): Name {
        let copy = Object.create(this);

        this.assertClassInvariance();
        MethodFailedException.assertCondition(this.isEqual(copy));

        return copy;
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertValidDelimiter(delimiter);
        let result : string = this.getComponents()
            .map(c => c.replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER))
            .map(c => c.replaceAll(ESCAPE_CHARACTER + this.doGetDelimiter(), this.doGetDelimiter()))
            .join(delimiter);
        
        this.assertClassInvariance();
        if (this.getNoComponents() > 1) 
            MethodFailedException.assertCondition(result !== "");
        MethodFailedException.assertCondition(!result.includes("/"))
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        if (this.getDelimiterCharacter() !== DEFAULT_DELIMITER) {
            // Need to unmask control characters
            return this.getComponents()
                .map(c => c.replaceAll(ESCAPE_CHARACTER + this.doGetDelimiter(), this.doGetDelimiter()))
                .join(DEFAULT_DELIMITER);
        }
        let result : string = this.getComponents().join(DEFAULT_DELIMITER);

        this.assertClassInvariance();

        this.assertDataSting(result);
        return result;
    }

    public isEqual(other: Name): boolean {
        IllegalArgumentException.assertIsNotNullOrUndefined(other);
        IllegalArgumentException.assertCondition(this.isCorrectlyMasked(other), "Name is not correctly masked")
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

    public isEmpty(): boolean {
        let empty : boolean = this.getNoComponents() === 0;
        this.assertClassInvariance();
        try {
            this.getComponent(0); // Should not return on error
            if (empty)
                throw new MethodFailedException("Method failed");
        } catch (e) {
            MethodFailedException.assertCondition(e instanceof IllegalArgumentException);
        }
        return empty;
    }

    public getDelimiterCharacter(): string {
        let delimiter = this.doGetDelimiter();
        this.assertClassInvariance();
        MethodFailedException.assertCondition(delimiter == this.doGetDelimiter(), "Method failed");
        try {
            this.assertValidDelimiter(delimiter);
        } catch {
            throw new MethodFailedException("Method failed");
        }
        return delimiter;
    }

    public getNoComponents(): number {
        return this.doGetNoComponents();
    }

    public getComponent(i: number): string {
        this.assertValidIndex(i);

        let component : string = this.doGetComponent(i);

        this.assertClassInvariance();

        MethodFailedException.assertCondition(this.isComponentCorrectlyMasked(component));
        return component;
    } 

    public setComponent(i: number, c: string) {
        this.assertValidIndex(i);
        this.assertisProperlyMasked(c);

        this.tryMethodOrRollback( () => {
            this.doSetComponent(i, c);
            
            this.assertClassInvariance();
            MethodFailedException.assertCondition(this.getComponent(i) === c);
        })
    }
    
    public insert(i: number, c: string) {
        this.assertValidIndex(i, true);
        this.assertisProperlyMasked(c);

        this.tryMethodOrRollback(() => {
            const oldNo : number = this.getNoComponents();
            this.doInsert(i, c);
            
            this.assertClassInvariance();
            MethodFailedException.assertCondition(this.getNoComponents() === oldNo + 1);
        });
    }

    public append(c: string) {
        this.assertisProperlyMasked(c);

        this.tryMethodOrRollback(() => {
            const oldNo : number = this.getNoComponents();
            this.doAppend(c);

            this.assertClassInvariance();
            MethodFailedException.assertCondition(this.getNoComponents() === oldNo + 1);
        });
    }

    public remove(i: number) {
        this.assertValidIndex(i);

        this.tryMethodOrRollback(() => {
            const oldNo : number = this.getNoComponents();

            this.doRemove(i);

            this.assertClassInvariance();
            MethodFailedException.assertCondition(this.getNoComponents() === oldNo - 1);
        });
    }


    protected abstract doGetNoComponents(): number;

    protected abstract doGetComponent(i: number): string;
    protected abstract doSetComponent(i: number, c: string): void;

    protected abstract doInsert(i: number, c: string): void;
    protected abstract doAppend(c: string): void;
    protected abstract doRemove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(other);
        IllegalArgumentException.assertCondition(other.getDelimiterCharacter() == this.doGetDelimiter(), "Delimiters did not match!");
        IllegalArgumentException.assertCondition(this.isCorrectlyMasked(other), "Passed name is not valid!");
        let expectedNoComponents = this.getNoComponents() + other.getNoComponents();

        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        this.assertClassInvariance();
        MethodFailedException.assertCondition(this.getNoComponents() === expectedNoComponents, "Method failed.");
    }

    protected doSetDelimiter(delimiter : string) {
        this.delimiter = delimiter;
    }

    protected doGetDelimiter() : string {
        return this.delimiter;
    }

    protected assertValidDelimiter(c : string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(typeof c === "string", "Delimiter must be a string");
        IllegalArgumentException.assertCondition(c.length === 1, "Delimiter must be exactly one character");
        IllegalArgumentException.assertCondition(c !== ESCAPE_CHARACTER, "Delimiter cannot be the escape character!");
    }

    protected assertDataSting(s : string) : void {
        try {
            let name = new StringName(s, DEFAULT_DELIMITER);
            MethodFailedException.assertCondition(name.getNoComponents() === this.getNoComponents(), "Data String corrupt");
        } catch {
            throw new MethodFailedException("Data String corrupt");
        }
    }

    protected assertValidIndex(i : number, inclusive : boolean = false) {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        IllegalArgumentException.assertCondition(inclusive || (i >= 0 && i < this.getNoComponents()));
        IllegalArgumentException.assertCondition(!inclusive || (i >= 0 && i <= this.getNoComponents()));
        IllegalArgumentException.assertCondition(Number.isInteger(i));
    }

    protected assertisProperlyMasked(c : string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
        IllegalArgumentException.assertCondition(this.isComponentCorrectlyMasked(c, this.doGetDelimiter()));
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

    protected isCorrectlyMasked(n : Name) : boolean {
       for (let i = 0; i < n.getNoComponents(); i++) {
            if (!this.isComponentCorrectlyMasked(n.getComponent(i), n.getDelimiterCharacter())) {
                return false;
            }
       } 
       return true;
    }

    protected abstract tryMethodOrRollback(f : Function) : void;
    protected abstract assertClassInvariance() : void;

}