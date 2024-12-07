import { Exception } from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(pn != null && pn != undefined);
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
        // Don't check for class invariant, otherwise injection would fail
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.add(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to != null && to != undefined);
        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;
        this.assertClassInvariants();
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, new IllegalArgumentException("Illegal base name"));
        this.doSetBaseName(bn);
        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(bn != null && bn != undefined);
        IllegalArgumentException.assert(bn != "");
        const result : Set<Node> = new Set();
        
        try {
            if (bn === this.getBaseName()) {
                result.add(this);
            }
            this.assertClassInvariants();
        } catch (e : any) {
            throw new ServiceFailureException("A severe error occured!", e);
        }
        return result;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, new InvalidStateException("Class invariant failed."));
    }

    protected assertIsValidBaseName(bn: string, ex: Exception): void {
        if (!(typeof bn === "string" && (bn != ""))) {
           throw ex;
        }
    }

}
