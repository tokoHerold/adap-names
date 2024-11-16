import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";
import { AbstractName } from "./AbstractName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Extra-Tests", () => {

  function testDataString(original: string, delimiter?: string) {
    // Data String of a StringName should be the same as constructor
    let nString : Name = new StringName(original, delimiter);
    expect(nString.asDataString()).toBe(original);

    // Create an equal StringArrayName
    let nArray : StringArrayName = new StringArrayName([""], delimiter);
    nArray.concat(nString);
    nArray.remove(0);
    expect(nArray.getNoComponents()).toBe(nString.getNoComponents());
    for(let i = 0; i < nArray.getNoComponents(); i++) {
      expect(nArray.getComponent(i)).toBe(nString.getComponent(i));
    }

    // The dataString of the StringArrayNameObject should be the same as original
    expect(nArray.asDataString()).toBe(original);
    let nString2 : Name = new StringName(nArray.asDataString(), delimiter);
    expect(nString2.asDataString()).toBe(original);
    expect(nString2.getNoComponents()).toBe(nString.getNoComponents());
    for(let i = 0; i < nString2.getNoComponents(); i++) {
      expect(nString2.getComponent(i)).toBe(nString.getComponent(i));
    }
  }

  it ("Cloning", () => {
    let nArray : Name = new StringArrayName(["cs", "fau", "de"]);
    let copyArray : Name = (nArray as AbstractName).clone();
    expect(copyArray.isEqual(nArray)).toBeTruthy();
    expect(nArray.getHashCode()).toBe(copyArray.getHashCode());

    nArray.insert(0, "cip");
    expect(copyArray.isEqual(nArray)).toBeTruthy();
    expect(nArray.getHashCode()).toBe(copyArray.getHashCode());

    let nString : Name = new StringName("cs.fau.de");
    let copyString : Name = (nString as AbstractName).clone();
    expect(copyString.isEqual(nString)).toBeTruthy();
    expect(nString.getHashCode()).toBe(copyString.getHashCode());

    expect(copyString.isEqual(copyArray)).toBeFalsy();
    expect(copyArray.getHashCode() !== copyString.getHashCode()).toBeTruthy();

    nString.insert(0, "cip");
    expect(copyString.isEqual(nString)).toBeTruthy();
    expect(nString.getHashCode()).toBe(copyString.getHashCode());
    
    expect(copyString.isEqual(copyArray)).toBeTruthy();
    expect(copyArray.getHashCode()).toBe(copyString.getHashCode());
  });

  it ("Equality", () => {
    let nStringA : Name = new StringName("oss.cs.fau.de")
    let nStringB : Name = new StringName("oss.cs.fau.de")
    let nArrayA : Name = new StringArrayName(["oss", "cs", "fau", "de"])
    let nArrayB : Name = new StringArrayName(["oss", "cs", "fau", "de"])
    expect(nStringA.isEqual(nStringB)).toBeTruthy;
    expect(nStringB.isEqual(nArrayA)).toBeTruthy;
    expect(nArrayA.isEqual(nArrayB)).toBeTruthy;
    expect(nStringA.getHashCode()).toBe(nStringB.getHashCode());
    expect(nStringA.getHashCode()).toBe(nArrayA.getHashCode());
    expect(nStringA.getHashCode()).toBe(nArrayB.getHashCode());

    let nStringC : Name = new StringName("oss#cs#fau#de", "#");
    let nStringD : Name = new StringName("oss.cs.fau.de", "#");
    expect(nStringA.isEqual(nStringC)).toBeFalsy;
    expect(nStringA.isEqual(nStringD)).toBeFalsy;
    expect(nStringA.getHashCode() === nStringC.getHashCode()).toBeFalsy();
    expect(nStringA.getHashCode() === nStringD.getHashCode()).toBeFalsy();
  });

  it("Concat", () => {
    let nStringA : Name = new StringName("oss.cs");
    let nArrayA : Name = new StringArrayName(["fau", "de"]);
    nStringA.concat(nArrayA);
    expect(nStringA.getNoComponents()).toBe(4);
    expect(nStringA.asString()).toBe("oss.cs.fau.de");

    let nStringB : Name = new StringName("oss.cs.fau");
    let nArrayB : Name = new StringArrayName(["de"]);
    nStringB.concat(nArrayB);
    expect(nStringB.getNoComponents()).toBe(4);
    expect(nStringB.asString()).toBe("oss.cs.fau.de");

    let nStringC : Name = new StringName("fau.de");
    let nArrayC : Name = new StringArrayName(["oss", "cs"]);
    nArrayC.concat(nStringC);
    expect(nArrayC.getNoComponents()).toBe(4);
    expect(nArrayC.asString()).toBe("oss.cs.fau.de");
  })

  it("Full health check", () => {
    let nString : StringName = new StringName("oss.cs.fau.de");
    let nArray : StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);

    // asString
    expect(nString.asString()).toBe("oss.cs.fau.de");
    expect(nArray.asString()).toBe("oss.cs.fau.de");

    // asString with delimiter
    expect(nString.asString("o")).toBe("ossocsofauode");
    expect(nArray.asString("o")).toBe("ossocsofauode");

    // asDataString
    expect(nString.asDataString()).toBe("oss.cs.fau.de");
    expect(nArray.asDataString()).toBe("oss.cs.fau.de");
    
    // isEmpty
    expect(nString.isEmpty()).toBe(false);
    expect(nArray.isEmpty()).toBe(false);

    // getDelimiterCharacter
    expect(nString.getDelimiterCharacter()).toBe(".");
    expect(nArray.getDelimiterCharacter()).toBe(".");

    // getNoComponents
    expect(nString.getNoComponents()).toBe(4);
    expect(nArray.getNoComponents()).toBe(4);

    // getComponent
    let components = ["oss", "cs", "fau", "de"];
    for (let i = 0; i < nString.getNoComponents(); i++) {
      expect(nString.getComponent(i)).toBe(components[i]);
      expect(nArray.getComponent(i)).toBe(components[i]);
    }

    // setComponent
    nString.setComponent(1, "c\\.s");
    nArray.setComponent(1, "c\\.s");
    expect(nString.getComponent(1)).toBe("c\\.s");
    expect(nString.asDataString()).toBe("oss.c\\.s.fau.de");
    expect(nArray.asString()).toBe("oss.c.s.fau.de");
    expect(nArray.getComponent(1)).toBe("c\\.s");
    expect(nArray.asDataString()).toBe("oss.c\\.s.fau.de");
    expect(nArray.asString()).toBe("oss.c.s.fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // insert(0)
    nString.insert(0, "yep");
    nArray.insert(0, "yep");
    expect(nString.getComponent(0)).toBe("yep");
    expect(nString.asDataString()).toBe("yep.oss.c\\.s.fau.de");
    expect(nArray.asString()).toBe("yep.oss.c.s.fau.de");
    expect(nArray.getComponent(0)).toBe("yep");
    expect(nArray.asDataString()).toBe("yep.oss.c\\.s.fau.de");
    expect(nArray.asString()).toBe("yep.oss.c.s.fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // insert(5)
    nString.insert(5, "yep");
    nArray.insert(5, "yep");
    expect(nString.getComponent(5)).toBe("yep");
    expect(nString.asDataString()).toBe("yep.oss.c\\.s.fau.de.yep");
    expect(nArray.asString()).toBe("yep.oss.c.s.fau.de.yep");
    expect(nArray.getComponent(5)).toBe("yep");
    expect(nArray.asDataString()).toBe("yep.oss.c\\.s.fau.de.yep");
    expect(nArray.asString()).toBe("yep.oss.c.s.fau.de.yep");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // insert(3)
    nString.insert(3, "yeppers");
    nArray.insert(3, "yeppers");
    expect(nString.getComponent(3)).toBe("yeppers");
    expect(nString.asDataString()).toBe("yep.oss.c\\.s.yeppers.fau.de.yep");
    expect(nArray.asString()).toBe("yep.oss.c.s.yeppers.fau.de.yep");
    expect(nArray.getComponent(3)).toBe("yeppers");
    expect(nArray.asDataString()).toBe("yep.oss.c\\.s.yeppers.fau.de.yep");
    expect(nArray.asString()).toBe("yep.oss.c.s.yeppers.fau.de.yep");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // append
    nString.append("coggers");
    nArray.append("coggers");
    expect(nString.getNoComponents()).toBe(8);
    expect(nString.getComponent(7)).toBe("coggers");
    expect(nString.asString()).toBe("yep.oss.c.s.yeppers.fau.de.yep.coggers");
    expect(nArray.getNoComponents()).toBe(8);
    expect(nArray.getComponent(7)).toBe("coggers");
    expect(nArray.asString()).toBe("yep.oss.c.s.yeppers.fau.de.yep.coggers");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // remove
    nString.remove(7);
    nString.remove(0);
    nString.remove(5);
    nString.remove(2);
    nArray.remove(7);
    nArray.remove(0);
    nArray.remove(5);
    nArray.remove(2);
    expect(nString.getNoComponents()).toBe(4);
    expect(nArray.getNoComponents()).toBe(4);
    expect(nString.asDataString()).toBe("oss.c\\.s.fau.de");
    expect(nArray.asDataString()).toBe("oss.c\\.s.fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();
    nString.setComponent(1, "cs");
    nArray.setComponent(1, "cs");
    expect(nString.asDataString()).toBe("oss.cs.fau.de");
    expect(nArray.asDataString()).toBe("oss.cs.fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();
  });

  it("funny delimiter magic", () => {
    let nArray : Name = new StringArrayName(["o\\s\\s", "c\\s", "fau", "de"], "s");
    expect(nArray.asDataString()).toBe("o\\s\\ssc\\ssfausde");
    let nString : Name = new StringName(nArray.asDataString(), "s");
    expect(nString.getComponent(0)).toBe("o\\s\\s");
    expect(nArray.asString()).toBe("ossscssfausde");
    expect(nString.asString()).toBe("ossscssfausde");
    expect(nString.getNoComponents()).toBe(4);
    expect(nString.asDataString()).toBe("o\\s\\ssc\\ssfausde");
    expect(nArray.isEqual(nString)).toBeTruthy();
  });

  it("unfunny delimiter magic", () => {
    let nArray : Name = new StringArrayName(["o\\.\\.", "c\\.", "fau", "de"]);
    expect(nArray.asDataString()).toBe("o\\.\\..c\\..fau.de");
    let nString : Name = new StringName(nArray.asDataString());
    expect(nString.asDataString()).toBe("o\\.\\..c\\..fau.de");
    expect(nArray.asString(".")).toBe("o...c..fau.de");
    expect(nString.asString(".")).toBe("o...c..fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();
  });

  it("Emtpy:", () => {
    let nString : Name = new StringName("");
    let nArray : Name = new StringArrayName([""]);

    // "" of StringName is equivalent to [""] of StringArrayName
    expect(nString.getNoComponents()).toBe(1);
    expect(nArray.getNoComponents()).toBe(1);

    expect(nString.asString()).toBe("");
    expect(nArray.asString()).toBe("");
    testDataString("");
  });

  it("Escape-Characters", () => {
    let nString : Name = new StringName("oss\\\\.fa\\\\u.de");
    let nArray : Name = new StringArrayName(["oss\\\\", "fa\\\\u", "de"]);

    expect(nString.asString("|")).toBe("oss\\|fa\\u|de");
    expect(nArray.asString("|")).toBe("oss\\|fa\\u|de");
    expect(nString.getNoComponents()).toBe(3);
    expect(nArray.getNoComponents()).toBe(3);

    testDataString("oss\\\\.fa\\\\u.de");
  });

  it("Escaped Delimiters", () => {
    let nString : Name = new StringName("oss\\..fa\\.u.de");
    let nArray : Name = new StringArrayName(["oss\\.", "fa\\.u", "de"]);

    expect(nString.asString()).toBe("oss..fa.u.de");
    expect(nArray.asString()).toBe("oss..fa.u.de");
    testDataString("oss\\..fa\\.u.de");
  });

  it ("Edge Cases", () => {
    let nString : Name = new StringName("\\.")
    let nArray : Name = new StringArrayName(["\\."])
    expect(nString.asString()).toBe(".");
    expect(nArray.asString()).toBe(".");
    expect(nString.getNoComponents()).toBe(1);
    expect(nArray.getNoComponents()).toBe(1);

    nString = new StringName("\\\\")
    nArray = new StringArrayName(["\\\\"])
    expect(nString.asString()).toBe("\\");
    expect(nArray.asString()).toBe("\\");
    expect(nString.getNoComponents()).toBe(1);
    expect(nArray.getNoComponents()).toBe(1);

    nString = new StringName("oss.cs.")
    nArray = new StringArrayName(["oss", "cs", ""])
    expect(nString.asString()).toBe("oss.cs.");
    expect(nArray.asString()).toBe("oss.cs.");
    expect(nString.getNoComponents()).toBe(3);
    expect(nArray.getNoComponents()).toBe(3);

    nString = new StringName(".oss..cs.")
    nArray = new StringArrayName(["", "oss", "" ,"cs", ""])
    expect(nString.asString()).toBe(".oss..cs.");
    expect(nArray.asString()).toBe(".oss..cs.");
    expect(nString.getNoComponents()).toBe(5);
    expect(nArray.getNoComponents()).toBe(5);

    testDataString("\\.");
    testDataString("\\\\");
    testDataString("oss.cs.");
    testDataString(".oss..cs.");
  });
});
