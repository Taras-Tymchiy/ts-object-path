import { createProxy, get, set } from "../src/ts-object-path"
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
    expect(p._path).toEqual([]);
  })
  it("Gets path from proxy", () => {
    const p = createProxy<ITest>();
    expect(p.one._path).toEqual(['one']);
    expect(p.three.second._path).toEqual(['three', 'second']);
    expect(p.four[4].second._path).toEqual(['four', 4, 'second']);
  })
})

describe("getValue test", () => {
  it("Works with proxy", () => {
    const p = createProxy<ITest>();
    const o: ITest = { one: 4 };
    const v = get(o, p.one);
    expect(v).toEqual(o.one);
  })
  it("Works with deep props", () => {
    let o: any;
    expect(get<number>(o, createProxy<ITest>().three.firrst)).toBeUndefined();

    o = { one: 5, three: { firrst: 4 } };
    expect(get< number>(o, createProxy<ITest>().three.firrst)).toEqual(o.three.firrst);
  })
  it("Works with arrays", () => {
    const o: any = { one: 5, four: [null, { firrst: 4 }] };
    expect(get< number>(o, createProxy<ITest>().four[0].firrst)).toBeUndefined();
    expect(get< number>(o, createProxy<ITest>().four[1].firrst)).toEqual(4);
  })
  it("returns default value", () => {
    const o: ITest = { one: 4 };
    const v = get(o, createProxy<ITest>().three.second, 'default' as string);
    expect(v).toEqual('default');
  })
  it('works with 0 value', ()=>{
    const o: ITest = {one: 0};
    const v = get(o, createProxy<ITest>().one, 1234);
    expect(v).toEqual(0);
  })
  it('works with function as proxy', ()=>{
    const o = { one: 5, three: { firrst: 4 }, four: [null, {firrst: 4}] };

    expect(get(o, (p)=>p.one)).toEqual(5)
    expect(get(o, (p)=>p.three)).toEqual({firrst: 4})
    expect(get(o, (p)=>p.three.firrst)).toEqual(4)
    expect(get(o, (p)=>p.four[0].firrst)).toBeUndefined()
    expect(get(o, (p)=>p.four[1].firrst)).toEqual(4)
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
    set(o, createProxy<ITest>().one, 333);
    expect(o.one).toEqual(333);
  })
  it("Works with deep props", () => {
    let o: any = { one: 5, three: { firrst: 4 } };
    set(o, createProxy<ITest>().three.firrst, 777);
    expect(o.three.firrst).toEqual(777);
  })
  it("Works with arrays", () => {
    const o: any = { one: 5, four: [null, { firrst: 4 }] };
    set(o, createProxy<ITest>().four[1].firrst, 666);
    expect(o.four[1].firrst).toEqual(666);
  })


  it("Creates nested objects", () => {
    const o: any = { one: 5 };
    set(o, createProxy<ITest>().three.firrst, 777);
    expect(o.three.firrst).toEqual(777);
  })
  it("Creates nested arrays", () => {
    const o: any = { one: 5 };
    set(o, createProxy<ITest>().four[1].firrst, 666);
    expect(o.four[1].firrst).toEqual(666);
    expect(o.four).toHaveLength(2);
  })

  it('works with function as proxy', ()=>{
    const o: ITest = { one: 4 };
    set(o, (p)=>p.one, 333);
    set(o, (p)=>p.two, '222');
    set(o, (p)=>p.three.firrst, 777);
    set(o, (p)=>p.four[1].firrst, 666);
    expect(o.one).toEqual(333);
    expect(o.two).toEqual('222');
    // @ts-ignore
    expect(o.three.firrst).toEqual(777);
    // @ts-ignore
    expect(o.four[1].firrst).toEqual(666);
  })
})
