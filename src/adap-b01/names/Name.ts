export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        for (let i = 0; i < other.length; i++) {
            this.components.push(other[i]);
        }
        if (delimiter != undefined)
            this.delimiter = delimiter;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation or deletion");
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        throw new Error("needs implementation or deletion");
    }
    
    public asNameString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public getComponent(i: number): string {
<<<<<<< HEAD
        throw new Error("needs implementation or deletion");
=======
        return this.components[i];
>>>>>>> 3f1cdad (Add basic functionality to Names.ts)
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
<<<<<<< HEAD
        throw new Error("needs implementation or deletion");
    }

     /** Returns number of components in Name instance */
     public getNoComponents(): number {
        throw new Error("needs implementation or deletion");
=======
        this.components[i] = c;
    }

    public getNoComponents(): number {
        return this.components.length;
>>>>>>> 3f1cdad (Add basic functionality to Names.ts)
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
<<<<<<< HEAD
        throw new Error("needs implementation or deletion");
=======
        this.components.splice(i, 0, c);
>>>>>>> 3f1cdad (Add basic functionality to Names.ts)
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
<<<<<<< HEAD
        throw new Error("needs implementation or deletion");
    }

    public remove(i: number): void {
        throw new Error("needs implementation or deletion");
=======
        this.components.push(c);
    }

    public remove(i: number): void {
        if (0 >= i && i < this.components.length) {
            this.components.splice(i, 1);
        }
>>>>>>> 3f1cdad (Add basic functionality to Names.ts)
    }

}