import { ObjPathProxy } from './obj-path-proxy';
export * from './obj-path-proxy';

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

export function getPath<TRoot, T>(obj: ObjPathProxy<TRoot, T>): PropertyKey[] {
  return (obj as any)[pathSymbol];
}

export function isProxy<TRoot, T>(value: any): value is ObjPathProxy<TRoot, T> {
  return value && typeof value === 'object' && !!getPath<TRoot, T>(value as ObjPathProxy<TRoot, T>);
}

