import { Node } from "./Node";
import { Directory } from "./Directory";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        InvalidStateException.assertCondition(this.doGetFileState() === FileState.CLOSED, "Can only open closed files!");
        // do something
    }

    public read(noBytes: number): Int8Array {
        // read something
        return new Int8Array();
    }

    public close(): void {
        InvalidStateException.assertCondition(this.doGetFileState() === FileState.OPEN, "Can only close open files!");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}