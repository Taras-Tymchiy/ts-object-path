import { ObjPathProxy } from './obj-path-proxy';
export * from './obj-path-proxy';

export type ObjProxyArg<TRoot, T> = ObjPathProxy<TRoot, T> | ((p: ObjPathProxy<TRoot, TRoot>)=> ObjPathProxy<TRoot, T>);

const pathSymbol = Symbol('Object path');

export function createProxy<T>(path: PropertyKey[] = []): ObjPathProxy<T, T> {
  const proxy = new Proxy({[pathSymbol]: path}, {
    get (target, key) {
      if (key === pathSymbol) {
        return target[pathSymbol];
      }
      if (typeof key === 'string') {
        const intKey = parseInt(key, 10);
        if (key === intKey.toString()) {
          key = intKey;
        }
      }
      return createProxy([...(path || []), key]);
    }
  });
  return proxy as any as ObjPathProxy<T, T>;
}

export function getPath<TRoot, T>(proxy: ObjProxyArg<TRoot, T>): PropertyKey[] {
  if (typeof proxy === 'function') {
    proxy = proxy(createProxy<TRoot>())
  }
  return (proxy as any)[pathSymbol];
}

export function isProxy<TRoot, T>(value: any): value is ObjPathProxy<TRoot, T> {
  return value && typeof value === 'object' && !!getPath<TRoot, T>(value as ObjPathProxy<TRoot, T>);
}

export function get<TRoot, T>(object: TRoot, proxy: ObjProxyArg<TRoot, T>, defaultValue: T|null|undefined = undefined) {
  return getPath(proxy).reduce((o, key) => o && o[key] || defaultValue, object as any) as T;
}

export function set<TRoot, T>(object: TRoot, proxy: ObjProxyArg<TRoot, T>, value: T): void {
  getPath(proxy).reduce((o: any, key, index, keys) => {
    if (index < keys.length - 1) {
      o[key] = o[key] || (typeof keys[index + 1] === 'number' ? [] : {});
      return o[key];
    }
    o[key] = value;
  }, object);
}

