import { createProxy, isProxy, getPath } from "../src/ts-object-path"
import {} from 'jest';

interface ITest {
  one: number;
  two: string;
  three: INestedTest;
}

interface INestedTest {
  firrst: number;
  second: string;
}

describe("createProxy test", () => {
  it("Creates proxy", () => {
    const p = createProxy<ITest>();
    expect(p).toBeTruthy()
  })
})

describe("getPath test", () => {
  it("Creates proxy with empty path", () => {
    const p = createProxy<ITest>();
    expect(getPath(p)).toEqual([]);
  })
  it("Gets path from proxy", () => {
    const p = createProxy<ITest>();
    expect(getPath(p.one)).toEqual(['one']);
    expect(getPath(p.three.second)).toEqual(['three', 'second']);
  })
  it("Gets path from proxy", () => {
    expect(getPath({})).toBeUndefined();
  })
})


describe("isProxy test", () => {
  it("Returns true for proxies", () => {
    const p = createProxy<ITest>();
    expect(isProxy(p)).toBeTruthy();
    expect(isProxy(p.three.firrst)).toBeTruthy();
  })
  it("Returns false for not proxies", () => {
    const p: any = {};
    expect(isProxy(p)).toBeFalsy();
    expect(isProxy(p.three)).toBeFalsy();
    expect(isProxy(undefined)).toBeFalsy();
    expect(isProxy(false)).toBeFalsy();
    expect(isProxy(7)).toBeFalsy();
    expect(isProxy('test')).toBeFalsy();
  })
})
