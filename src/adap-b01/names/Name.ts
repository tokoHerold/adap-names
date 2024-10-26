export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    /** @methodtype initialization-method */
    constructor(other: string[], delimiter?: string) {
        for (let i = 0; i < other.length; i++) {
            this.components.push(other[i]);
        }
        if (delimiter != undefined)
            this.delimiter = delimiter;
    }

    /** Returns human-readable representation of Name instance
    /** @methodtype conversion-method */
    public asNameString(delimiter: string = this.delimiter): string {
        let human_readable: string[] = [];
        // Replace special occurances:
        this.components.forEach((component) => {
            // escape characters inside components
            component = this.replaceAll(component, this.ESCAPE_CHARACTER, this.ESCAPE_CHARACTER + this.ESCAPE_CHARACTER);
            // delimiters inside components
            component = this.replaceAll(component, delimiter, this.ESCAPE_CHARACTER + delimiter);
            human_readable.push(component)
        });
        return human_readable.join(delimiter);
    }

    /**  @methodtype get-method */
    public getComponent(i: number): string {
        return this.components[i];
    }

    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    /** @methodtype command-method */
    public append(c: string): void {
        this.components.push(c);
    }

    /** @methodtype command-method */
    public remove(i: number): void {
        if (0 >= i && i < this.components.length) {
            this.components.splice(i, 1);
        }
    }

    /** Helper method 
     * tsconfig.json has the target JavaScript version set to 2016 (which is more than 8 years old btw),
     * in which "string.replaceAll" does not exist yet.
     */
    protected replaceAll(str : string, searchValue : string, replaceValue : string) : string {
        return str.split(searchValue).join(replaceValue);
    }

}