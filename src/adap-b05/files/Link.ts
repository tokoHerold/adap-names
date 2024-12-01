import { Node } from "./Node";
import { Directory } from "./Directory";
import { ExceptionType } from "../common/AssertionDispatcher";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(target);
        this.targetNode = target;
        this.assertClassInvariants();
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
        this.assertClassInvariants();
    }

    protected ensureTargetNode(target: Node | null): Node {
        IllegalArgumentException.assertIsNotNullOrUndefined(target);
        const result: Node = this.targetNode as Node;
        return result;
    }
}