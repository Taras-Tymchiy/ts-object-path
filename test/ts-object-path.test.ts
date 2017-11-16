import { createProxy, isProxy, getPath, get, set } from "../src/ts-object-path"
import {} from 'jest';

interface ITest {
  one: number;
  two?: string;
  three?: INestedTest;
  four?: INestedTest[];
}

interface INestedTest {
  firrst: number;
  second?: string;
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
    expect(getPath(p.four[4].second)).toEqual(['four', 4, 'second']);
  })
  it("Get undefined", () => {
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


describe("getValue test", () => {
  it("Works with proxy", () => {
    const p = createProxy<ITest>();
    const o: ITest = { one: 4 };
    const v = get(o, p.one);
    expect(v).toEqual(o.one);
  })
  it("Works with callback", () => {
    const v = get({ one: 4 }, p=> p.one);
    expect(v).toEqual(4);
  })
  it("Works with deep props", () => {
    let o: ITest;
    expect(get<ITest, number>(o, p=> p.three.firrst)).toBeUndefined();

    o = { one: 5, three: { firrst: 4 } };
    expect(get<ITest, number>(o, p=> p.three.firrst)).toEqual(o.three.firrst);
  })
  it("Works with arrays", () => {
    const o: ITest = { one: 5, four: [null, { firrst: 4 }] };
    expect(get<ITest, number>(o, p=> p.four[0].firrst)).toBeUndefined();
    expect(get<ITest, number>(o, p=> p.four[1].firrst)).toEqual(4);
  })
  it("Works with symbols", () => {
    const symb = Symbol('test');
    const o = { regularProp: { [symb]: 333 } };
    const v = get(o, p=> p.regularProp[symb]);
    expect(v).toEqual(333);
  })
  it("returns default value", () => {
    const o: ITest = { one: 4 };
    const v = get(o, p=> p.three.second, 'default' as string);
    expect(v).toEqual('default');
  })

})

describe("setValue test", () => {
  it("Works with proxy", () => {
    const p = createProxy<ITest>();
    const o: ITest = { one: 4 };
    set(o, p.one, 333);
    expect(o.one).toEqual(333);
  })
  it("Works with callback", () => {
    const o: ITest = { one: 4 };
    set(o, p=> p.one, 333);
    expect(o.one).toEqual(333);
  })
  it("Works with deep props", () => {
    let o: ITest = { one: 5, three: { firrst: 4 } };
    set(o, p=> p.three.firrst, 777);
    expect(o.three.firrst).toEqual(777);
  })
  it("Works with arrays", () => {
    const o: ITest = { one: 5, four: [null, { firrst: 4 }] };
    set(o, p=> p.four[1].firrst, 666);
    expect(o.four[1].firrst).toEqual(666);
  })

  it("Works with symbols", () => {
    const symb = Symbol('test');
    const o = { regularProp: { [symb]: 333 } };
    set(o, p=> p.regularProp[symb], 555);
    expect(o.regularProp[symb]).toEqual(555);
  })

  it("Creates nested objects", () => {
    const o: ITest = { one: 5 };
    set(o, p=> p.three.firrst, 777);
    expect(o.three.firrst).toEqual(777);
  })
  it("Creates nested arrays", () => {
    const o: ITest = { one: 5 };
    set(o, p=> p.four[1].firrst, 666);
    expect(o.four[1].firrst).toEqual(666);
    expect(o.four).toHaveLength(2);
  })
})
