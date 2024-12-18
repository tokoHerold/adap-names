import { Exception } from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to === this, "You cannot move the root directory!");
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        this.assertIsValidBaseName(bn, new IllegalArgumentException("You cannot rename a root directory!"));
        // null operation
    }

    protected assertIsValidBaseName(bn: string, ex: Exception): void {
        if (bn != "") {
           throw ex;
        }
    }

}