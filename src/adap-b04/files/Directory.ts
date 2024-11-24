import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        // Set automatically checks for duplicates
        IllegalArgumentException.assertIsNotNullOrUndefined(cn, "Child node was null or undefined!");
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn, "Child node was null or undefined!");
        IllegalArgumentException.assertCondition(this.childNodes.has(cn), "Child node does not exist in directory!");
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}