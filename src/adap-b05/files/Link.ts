import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        IllegalArgumentException.assert(pn != null && pn != undefined);
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        IllegalArgumentException.assert(target != null && target != undefined);
        this.targetNode = target;
        this.assertClassInvariants();
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, new IllegalArgumentException("Illegal base name!"));
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
        this.assertClassInvariants();
    }

    protected ensureTargetNode(target: Node | null): Node {
        IllegalArgumentException.assert(target != null && target != undefined);
        const result: Node = this.targetNode as Node;
        return result;
    }
}