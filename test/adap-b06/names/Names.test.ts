import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { AbstractName } from "../../../src/adap-b06/names/AbstractName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b06/common/InvalidStateException";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    let c : Name = n.insert(1, "cs");
    expect(n !== c).toBeTruthy();
    expect(c.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    let c : Name = n.append("de");
    expect(n !== c).toBeTruthy();
    expect(c.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let c : Name = n.remove(0);
    expect(n !== c).toBeTruthy();
    expect(c.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    let c : Name = n.insert(1, "cs");
    expect(n !== c).toBeTruthy();
    expect(c.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    let c : Name = n.append("de");
    expect(n !== c).toBeTruthy();
    expect(c.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let c : Name = n.remove(0);
    expect(n !== c).toBeTruthy();
    expect(c.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n = n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n = n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("Design By Contract Tests", () => {

    function testPreconditions(n : Name) {
        const clone : Object = structuredClone(n);
        Object.setPrototypeOf(clone, Object.getPrototypeOf(n));
        let delimiter : string = n.getDelimiterCharacter();

        // getComponent
        expect(() => n.getComponent(n.getNoComponents())).toThrow(IllegalArgumentException);
        expect(() => n.getComponent(-1)).toThrow(IllegalArgumentException);
        
        // setComponent
        expect(() => n.setComponent(n.getNoComponents(), "a")).toThrow(IllegalArgumentException);
        expect(() => n.setComponent(-1, "a")).toThrow(IllegalArgumentException);
        expect(() => n.setComponent(0, (null as any))).toThrow(IllegalArgumentException);
        expect(() => n.setComponent(0, "a\\b")).toThrow(IllegalArgumentException);
        expect(() => n.setComponent(0, "a" + delimiter)).toThrow(IllegalArgumentException);

        // insert
        expect(() => n.insert(0, (null as any))).toThrow(IllegalArgumentException);
        n.insert(n.getNoComponents(), "a"); // Should work
        
        expect(() => n.insert(n.getNoComponents() + 1, "a")).toThrow(IllegalArgumentException);
        expect(() => n.insert(n.getNoComponents(), "a\\b")).toThrow(IllegalArgumentException);
        expect(() => n.insert(n.getNoComponents(), delimiter + "a")).toThrow(IllegalArgumentException);

        // append
        expect(() => n.append((null as any))).toThrow(IllegalArgumentException);
        expect(() => n.append(delimiter)).toThrow(IllegalArgumentException);
        expect(() => n.append("\\")).toThrow(IllegalArgumentException);

        // remove
        expect(() => n.remove(n.getNoComponents())).toThrow(IllegalArgumentException);
        expect(() => n.remove(-1)).toThrow(IllegalArgumentException);

        // Concat
        expect(() => n.concat((null as any))).toThrow(IllegalArgumentException);

        // asString
        expect(() => n.asString("yo")).toThrow(IllegalArgumentException);
        expect(() => n.asString("")).toThrow(IllegalArgumentException);
        expect(() => n.asString((null as any))).toThrow(IllegalArgumentException);

        // isEqual
        expect(() => n.isEqual((null as any))).toThrow(IllegalArgumentException);

        // Assure that state was not modified
        expect(n.isEqual(clone)).toBeTruthy();
    }

    it("Preconditions", () =>  {
        expect(() =>new StringArrayName([""], "yo")).toThrow(IllegalArgumentException);
        expect(() =>new StringArrayName([""], "")).toThrow(IllegalArgumentException);
        expect(() =>new StringArrayName(["fau.de"], ".")).toThrow(IllegalArgumentException);
        expect(() =>new StringName("string", "yo")).toThrow(IllegalArgumentException);
        expect(() =>new StringName("string", "")).toThrow(IllegalArgumentException);
        expect(() =>new StringName("fa\\u.de", ".")).toThrow(IllegalArgumentException);

        expect(() =>new StringArrayName([""], (null as any))).toThrow(IllegalArgumentException);
        expect(() =>new StringName("string", (null as any))).toThrow(IllegalArgumentException);

        testPreconditions(new StringArrayName(["cs", "fau", "de", "ö"]));
        testPreconditions(new StringName("csüfauüde", "ü"));
    })

    it("ClassInvariance StringName", () => {
        let nString : StringName = new StringName("cs.fau.de");
        (nString as any)["noComponents"] = 4;
        expect(() => nString.getComponent(0)).toThrow(InvalidStateException);

        nString = new StringName("cs.fau.de");
        (nString as any)["name"] = "cs\\.fau.de";
        expect(() => nString.getHashCode()).toThrow(InvalidStateException);

        nString = new StringName("cs.fau.de");
        (nString as any)["name"] = "cs.s.fau.de";
        expect(() => nString.isEqual(nString)).toThrow(InvalidStateException);
        
        nString = new StringName("cs.fau.de");
        (nString as any)["name"] = "cs\\s.fau.de";
        expect(() => nString.isEmpty()).toThrow(InvalidStateException);
        
        nString = new StringName("cs.fau.de");
        (nString as any)["delimiter"] = "hallo";
        expect(() => nString.asDataString()).toThrow(InvalidStateException);
    });
    
    it("ClassInvariance StringArrayName", () => {
        let nArray : StringArrayName = new StringArrayName(["cs", "fau", "de"]);
        (nArray as any)["components"] = ["cs.s", "fau", "de"];
        expect(() => nArray.getDelimiterCharacter()).toThrow(InvalidStateException);

        nArray = new StringArrayName(["cs", "fau", "de"]);
        (nArray as any)["components"] = ["cs\\s", "fau", "de"];
        expect(() => nArray.insert(0, "a")).toThrow(InvalidStateException);

        nArray = new StringArrayName(["cs", "fau", "de"]);
        (nArray as any)["delimiter"] = "hallo";
        expect(() => nArray.clone()).toThrow(InvalidStateException);
    })


})

describe("Extra-Tests for functionality", () => {

  function testDataString(original: string, delimiter?: string) {
    // Data String of a StringName should be the same as constructor
    let nString : Name = new StringName(original, delimiter);
    expect(nString.asDataString()).toBe(original);

    // Create an equal StringArrayName
    let nArray : StringArrayName = new StringArrayName([""], delimiter);
    nArray = nArray.concat(nString) as StringArrayName;
    nArray = nArray.remove(0) as StringArrayName;
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

    // nArray.insert(0, "cip");
    // expect(copyArray.isEqual(nArray)).toBeTruthy();
    expect(nArray.getHashCode()).toBe(copyArray.getHashCode());

    let nString : Name = new StringName("cs.fau.de");
    let copyString : Name = (nString as AbstractName).clone();
    // expect(copyString.isEqual(nString)).toBeTruthy();
    expect(nString.getHashCode()).toBe(copyString.getHashCode());

    expect(copyString.isEqual(copyArray)).toBeTruthy();
    expect(copyArray.getHashCode() === copyString.getHashCode()).toBeTruthy();

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
    nStringA = nStringA.concat(nArrayA);
    expect(nStringA.getNoComponents()).toBe(4);
    expect(nStringA.asString()).toBe("oss.cs.fau.de");

    let nStringB : Name = new StringName("oss.cs.fau");
    let nArrayB : Name = new StringArrayName(["de"]);
    nStringB = nStringB.concat(nArrayB);
    expect(nStringB.getNoComponents()).toBe(4);
    expect(nStringB.asString()).toBe("oss.cs.fau.de");

    let nStringC : Name = new StringName("fau.de");
    let nArrayC : Name = new StringArrayName(["oss", "cs"]);
    nArrayC = nArrayC.concat(nStringC);
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
    let copyString = nString.setComponent(1, "c\\.s");
    let copyArray = nArray.setComponent(1, "c\\.s");
    expect(nString.getComponent(1)).toBe("cs");
    expect(nArray.getComponent(1)).toBe("cs");
    nString = copyString as StringName;
    nArray = copyArray as StringArrayName;

    expect(nString.getComponent(1)).toBe("c\\.s");
    expect(nString.asDataString()).toBe("oss.c\\.s.fau.de");
    expect(nArray.asString()).toBe("oss.c.s.fau.de");
    expect(nArray.getComponent(1)).toBe("c\\.s");
    expect(nArray.asDataString()).toBe("oss.c\\.s.fau.de");
    expect(nArray.asString()).toBe("oss.c.s.fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // insert(0)
    copyString = nString.insert(0, "yep");
    copyArray = nArray.insert(0, "yep");
    expect(nString.getComponent(0)).toBe("oss");
    expect(nArray.getComponent(0)).toBe("oss");
    nString = copyString as StringName;
    nArray = copyArray as StringArrayName;

    expect(nString.getComponent(0)).toBe("yep");
    expect(nString.asDataString()).toBe("yep.oss.c\\.s.fau.de");
    expect(nArray.asString()).toBe("yep.oss.c.s.fau.de");
    expect(nArray.getComponent(0)).toBe("yep");
    expect(nArray.asDataString()).toBe("yep.oss.c\\.s.fau.de");
    expect(nArray.asString()).toBe("yep.oss.c.s.fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // insert(5)
    nString = nString.insert(5, "yep") as StringName;
    nArray = nArray.insert(5, "yep") as StringArrayName;
    expect(nString.getComponent(5)).toBe("yep");
    expect(nString.asDataString()).toBe("yep.oss.c\\.s.fau.de.yep");
    expect(nArray.asString()).toBe("yep.oss.c.s.fau.de.yep");
    expect(nArray.getComponent(5)).toBe("yep");
    expect(nArray.asDataString()).toBe("yep.oss.c\\.s.fau.de.yep");
    expect(nArray.asString()).toBe("yep.oss.c.s.fau.de.yep");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // insert(3)
    nString = nString.insert(3, "yeppers") as StringName;
    nArray = nArray.insert(3, "yeppers") as StringArrayName;
    expect(nString.getComponent(3)).toBe("yeppers");
    expect(nString.asDataString()).toBe("yep.oss.c\\.s.yeppers.fau.de.yep");
    expect(nArray.asString()).toBe("yep.oss.c.s.yeppers.fau.de.yep");
    expect(nArray.getComponent(3)).toBe("yeppers");
    expect(nArray.asDataString()).toBe("yep.oss.c\\.s.yeppers.fau.de.yep");
    expect(nArray.asString()).toBe("yep.oss.c.s.yeppers.fau.de.yep");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // append
    copyString = nString.append("coggers");
    copyArray = nArray.append("coggers");
    expect(nString.getNoComponents()).toBe(copyString.getNoComponents() - 1);
    expect(nArray.getNoComponents()).toBe(copyArray.getNoComponents() - 1);
    nString = copyString as StringName;
    nArray = copyArray as StringArrayName;

    expect(nString.getNoComponents()).toBe(8);
    expect(nString.getComponent(7)).toBe("coggers");
    expect(nString.asString()).toBe("yep.oss.c.s.yeppers.fau.de.yep.coggers");
    expect(nArray.getNoComponents()).toBe(8);
    expect(nArray.getComponent(7)).toBe("coggers");
    expect(nArray.asString()).toBe("yep.oss.c.s.yeppers.fau.de.yep.coggers");
    expect(nArray.isEqual(nString)).toBeTruthy();

    // remove
    copyString = nString.remove(7);
    copyString = copyString.remove(0);
    copyString = copyString.remove(5);
    copyString = copyString.remove(2);
    copyArray = nArray.remove(7);
    copyArray = copyArray.remove(0);
    copyArray = copyArray.remove(5);
    copyArray = copyArray.remove(2);

    expect(nString.getNoComponents()).toBe(8)
    expect(nArray.getNoComponents()).toBe(8);
    expect(nString.getComponent(7)).toBe("coggers");
    expect(nArray.getComponent(7)).toBe("coggers");
            
    nString = copyString as StringName;
    nArray = copyArray as StringArrayName;

    expect(nString.getNoComponents()).toBe(4);
    expect(nArray.getNoComponents()).toBe(4);
    expect(nString.asDataString()).toBe("oss.c\\.s.fau.de");
    expect(nArray.asDataString()).toBe("oss.c\\.s.fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();
    nString = nString.setComponent(1, "cs") as StringName;
    nArray = nArray.setComponent(1, "cs") as StringArrayName;
    expect(nString.asDataString()).toBe("oss.cs.fau.de");
    expect(nArray.asDataString()).toBe("oss.cs.fau.de");
    expect(nArray.isEqual(nString)).toBeTruthy();
  });

  it("funny delimiter magic", () => {
    let nArray : Name = new StringArrayName(["o\\s\\s", "c\\s", "fau", "de"], "s");
    expect(nArray.asDataString()).toBe("oss.cs.fau.de");
    let nString : Name = new StringName(nArray.asDataString().replaceAll("s", "\\s").replaceAll(".", "s"), "s");
    expect(nString.getComponent(0)).toBe("o\\s\\s");
    expect(nArray.asString()).toBe("ossscssfausde");
    expect(nString.asString()).toBe("ossscssfausde");
    expect(nString.getNoComponents()).toBe(4);
    expect(nString.asDataString()).toBe("oss.cs.fau.de");
  });

  it("unfunny delimiter magic", () => {
    let nArray : Name = new StringArrayName(["o\\.\\.", "c\\.", "fau", "de"], ".");
    expect(nArray.asDataString()).toBe("o\\.\\..c\\..fau.de");
    let nString : Name = new StringName(nArray.asDataString(), ".");
    expect(nString.asDataString()).toBe("o\\.\\..c\\..fau.de");
    expect(nArray.asString(".")).toBe("o...c..fau.de");
    expect(nString.asString(".")).toBe("o...c..fau.de");
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