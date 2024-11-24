import { describe, expect, it } from "vitest";
import { RootNode } from "../../../src/adap-b04/files/RootNode";
import { File } from "../../../src/adap-b04/files/File";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { Directory } from "../../../src/adap-b04/files/Directory";
import { Link } from "../../../src/adap-b04/files/Link";

describe("File precondition test", () => {
   it("RootNode", () => {
        let node : RootNode = new RootNode();
        expect(() => node.move(node)).toThrow(IllegalArgumentException);
   });

   it("Directory", () => {
        let root : RootNode = new RootNode();
        let boot : Directory = new Directory("boot", root);
        let home : Directory = new Directory("home", root);
        let w = new File("Windows", boot);
        
        expect(() => w.move(home)).toThrow(IllegalArgumentException);
        boot.add(w);
        expect(w.move(home), "This should not throw an error!");
        expect(() => w.move(null as any)).toThrow(IllegalArgumentException);
        expect(() => boot.remove(home)).toThrow(IllegalArgumentException);
        expect(() => boot.remove(null as any)).toThrow(IllegalArgumentException);
    });

    it("Link", () => {
        let root : RootNode = new RootNode();
        let boot : Directory = new Directory("boot", root);
        let home : Directory = new Directory("home", root);
        let efi = new File("efi", boot);
        boot.add(efi);
        let mnt = new Link("efi", home);
        home.add(efi);

        expect(() => mnt.rename("ife")).toThrow(IllegalArgumentException);
        expect(() => mnt.getBaseName()).toThrow(IllegalArgumentException);
        expect(() => mnt.setTargetNode((null as any))).toThrow(IllegalArgumentException);
        mnt.setTargetNode(efi)
        mnt.getBaseName(); // Should not throw error now
        mnt.rename("ife");
        expect(efi.getBaseName()).toBe("ife");     
    })
});