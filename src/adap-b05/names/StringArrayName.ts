import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assertCondition(this.isValidlyMasked(source));

        let components : string[] = [];
        source.forEach(e => components.push(e));
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
            this.append(c);
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

    protected assertClassInvariance(): void {
        try {
            this.assertValidDelimiter(this.delimiter);
        } catch (e) {
            throw new InvalidStateException("Class invariant not met!");
        }
        InvalidStateException.assertIsNotNullOrUndefined(this.components);
        this.doGetComponents().forEach(
            c => InvalidStateException.assertCondition(this.isComponentCorrectlyMasked(c))
            );
    }

    protected tryMethodOrRollback(f : Function) : void {
        let copy : StringArrayName = this.deepCopy() as StringArrayName;
        try {
           f();
        } catch (e) {
            this.doSetComponents(copy.doGetComponents()); // Restore state
            throw e;
        }
    }
}