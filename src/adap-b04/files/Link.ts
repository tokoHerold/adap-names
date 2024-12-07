import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        IllegalArgumentException.assert(target != null && target != undefined, "Target must not be null or undefined!");
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }
    
    public rename(bn: string): void {
        IllegalArgumentException.assert(bn != null && bn != undefined, "BaseName must not be null or undefined!");
        IllegalArgumentException.assert(bn !== "", "Basename must not be empty!");
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        IllegalArgumentException.assert(target !== null, "Target node was not set!");
        const result: Node = this.targetNode as Node;
        return result;
    }
}