import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        IllegalArgumentException.assert(cn != null && cn != undefined);
        this.childNodes.add(cn);
        this.assertClassInvariants();
    }

    public remove(cn: Node): void {
        IllegalArgumentException.assert(cn != null && cn != undefined);
        IllegalArgumentException.assert(this.childNodes.has(cn));
        this.childNodes.delete(cn); // Yikes! Should have been called remove
        this.assertClassInvariants();
    }

    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(bn != null && bn != undefined);
        IllegalArgumentException.assert(bn != "");
       
        const results : Set<Node> = new Set();

        try {
            if (bn === this.doGetBaseName()) {
                results.add(this);
            }
            this.childNodes.forEach( cn => {
                cn.findNodes(bn).forEach( result => results.add(result));
            });

            this.assertClassInvariants();
        } catch (e : any) {
            if (e instanceof MethodFailedException || e instanceof InvalidStateException)
                throw new ServiceFailureException("A severe error occurred!", e);
            throw e;
        }
        return results;
    }

}