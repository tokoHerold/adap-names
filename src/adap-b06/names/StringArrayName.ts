import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
 
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(this.isValidlyMasked(other));
        
        let components : string[] = [];
        other.forEach(e => {
            components.push(this.deepCopy(e));
        });
        
        this.doSetComponents(components)
        
        this.assertClassInvariance();
    }
    
    protected doGetNoComponents(): number {
        return this.doGetComponents().length;
    }
    
    protected doGetComponent(i : number) : string {
        return this.doGetComponents()[i];
    }
    
    protected doSetComponent(i : number, c : string) {
        let components : string[] = this.doGetComponents();
        components[i] = c;
        this.doSetComponents(components);
    } 
    
    protected doInsert(i : number, c : string) {
        if (i >= 0 && i < this.components.length)
            this.components.splice(i, 0, c);
        else if (i === this.components.length)
            this.doAppend(c);
    } 
    
    
    protected doAppend(c: string) {
        let components : string[] = this.doGetComponents();
        components.push(c);
        this.doSetComponents(components);
    } 
    
    
    protected doRemove(i: number) {
        let components : string[] = this.doGetComponents();
        components.splice(i, 1);
        this.doSetComponents(components);
    } 
    
    protected doGetComponents() : string[] {
        return this.components;
    }
    
    protected doSetComponents(components : string[]) : void {
        this.components = components;
    }
    
    protected isValidlyMasked(components : string[] = this.doGetComponents()) : boolean {
        for (let c of components) {
            if (c === null || c === undefined) return false;
            if (!(typeof c === "string")) return false;
            if (!this.isComponentCorrectlyMasked(c, this.delimiter)) return false;
        }
        return true;
    }
    
    protected assertClassInvariance(before? : AbstractName): void {
        super.assertClassInvariance(before);
        try {
            this.assertValidDelimiter(this.delimiter);
        } catch (e) {
            throw new InvalidStateException("Class invariant not met!");
        }
        InvalidStateException.assert(this.components != null && this.components != undefined);
        this.doGetComponents().forEach(
            c => InvalidStateException.assert(this.isComponentCorrectlyMasked(c))
        );
    }
}