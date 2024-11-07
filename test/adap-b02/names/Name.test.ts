import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";
import { Name } from "../../adap-b01/names/Name";

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

describe("StringArrayName specific functions test", () => {

  function testInputs(fn : Function) : void {
    // Test standard inputs
    expect(fn("test")).toBe(true);
    expect(fn("")).toBe(true);

    // Test incorrectly formatted inputs
    expect(fn("fau.de")).toBe(false);
    expect(fn("fau\\..de")).toBe(false);
    expect(fn("fau\\de")).toBe(false);

    // Test correctly masked inputs
    expect(fn("fau\\.de")).toBe(true);
    expect(fn("fau\\\\de")).toBe(true);

    // Edge cases
    expect(fn("\\.")).toBe(true);
    expect(fn("\\\\")).toBe(true);

    expect(fn(".")).toBe(false);
    expect(fn("fau.")).toBe(false);
    expect(fn("fau\\.")).toBe(true);
    expect(fn(".fau")).toBe(false);
    expect(fn("\\.fau")).toBe(true);

    expect(fn("\\")).toBe(false);
    expect(fn("fau\\")).toBe(false);
    expect(fn("fau\\\\")).toBe(true);
    expect(fn("\\fau")).toBe(false);
    expect(fn("\\\\fau")).toBe(true);
    expect(fn("\\.\\")).toBe(false);
    expect(fn("\\..")).toBe(false);
    expect(fn(".\\.")).toBe(false);
  }

  it("Test valid and invalid user inputs", () => {
    let n : Name = new StringArrayName([]);
    let validate = Reflect.get(n, "isValid");
    testInputs(validate);
  });
});
