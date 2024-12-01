import { describe, it, expect } from "vitest";

import { Exception } from "../../../src/adap-b05/common/Exception";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { Link } from "../../../src/adap-b05/files/Link";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";
import { IllegalArgumentException } from "../../../src/adap-b05/common/IllegalArgumentException";
import { Exception } from "../../../src/adap-b05/common/Exception";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";

function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Basic naming test", () => {
  it("test name checking", () => {
    let fs: RootNode = createFileSystem();
    let ls: Node = [...fs.findNodes("ls")][0];
    expect(ls.getFullName().isEqual(new StringName("/usr/bin/ls", '/')));
  });
});

function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
    let threwException: boolean = false;
    try {
      let fs: RootNode = createBuggySetup();
      fs.findNodes("ls");
    } catch(er) {
      threwException = true;
      let ex: Exception = er as Exception;
      expect(ex instanceof ServiceFailureException).toBeTruthy();
      expect(ex.hasTrigger());
      let tx: Exception = ex.getTrigger();
      expect(tx instanceof InvalidStateException).toBeTruthy();
    }
    expect(threwException).toBeTruthy();
  });
});

describe("Error and Exception handling tests", () => {

  it("FindFile", () => {
    let rn: RootNode = new RootNode();

    let usr: Directory = new Directory("usr", rn);
    let bin: Directory = new Directory("bin", usr);
    let ls: File = new File("ls", bin);
    let code: File = new File("code", bin);

    let media: Directory = new Directory("media", rn);

    let home: Directory = new Directory("home", rn);
    let riehle: Directory = new Directory("riehle", home);
    let bashrc: File = new File(".bashrc", riehle);
    let wallpaper: File = new File("wallpaper.jpg", riehle);
    let projects: Directory = new Directory("projects", riehle);

    let toko : Directory = new Directory("toko", home);
    let bashrc2 : File = new File(".bashrc", toko);
    let uni : Directory = new Directory("uni", toko);
    let projects2 : Directory = new Directory("projects", uni);
    let adap : File = new File("adap", projects2);
    let link : Link = new Link("doesn't matter", projects2, wallpaper);

    expect(rn.findNodes("usr").has(usr)).toBeTruthy();
    expect(rn.findNodes("usr").size == 1).toBeTruthy();

    expect(rn.findNodes("bin").has(bin)).toBeTruthy();
    expect(rn.findNodes("bin").size == 1).toBeTruthy();

    expect(rn.findNodes(".bashrc").has(bashrc)).toBeTruthy();
    expect(rn.findNodes(".bashrc").has(bashrc2)).toBeTruthy();
    expect(rn.findNodes(".bashrc").size == 2).toBeTruthy();

    expect(rn.findNodes("projects").has(projects)).toBeTruthy();
    expect(rn.findNodes("projects").has(projects2)).toBeTruthy();
    expect(rn.findNodes("projects").size == 2).toBeTruthy();

    expect(riehle.findNodes(".bashrc").has(bashrc)).toBeTruthy();
    expect(riehle.findNodes(".bashrc").size == 1).toBeTruthy();

    expect(riehle.findNodes("projects").has(projects)).toBeTruthy();
    expect(riehle.findNodes("projects").size == 1).toBeTruthy();

    expect(rn.findNodes("wallpaper.jpg").has(wallpaper)).toBeTruthy();
    expect(rn.findNodes("wallpaper.jpg").has(link)).toBeTruthy();
    expect(rn.findNodes("wallpaper.jpg").size == 2).toBeTruthy();
 
  });

});

describe("File precondition test", () => {
   it("RootNode", () => {
        let root1 : RootNode = new RootNode();
        let root2 : Directory = new RootNode();
        expect(() => root1.move(root2)).toThrow(IllegalArgumentException);
   });

   it("Directory", () => {
        let root : RootNode = new RootNode();
        let boot : Directory = new Directory("boot", root);
        let home : Directory = new Directory("home", root);
        let w = new File("Windows", boot);
        
        // expect(() => w.move(home)).toThrow(IllegalArgumentException); This is now fixed
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
        let mnt = new Link("efi", home);

        expect(() => mnt.rename("ife")).toThrow(IllegalArgumentException);
        expect(() => mnt.getBaseName()).toThrow(IllegalArgumentException);
        expect(() => mnt.setTargetNode((null as any))).toThrow(IllegalArgumentException);
        mnt.setTargetNode(efi)
        mnt.getBaseName(); // Should not throw error now
        mnt.rename("ife");
        expect(efi.getBaseName()).toBe("ife");     
    })
});
