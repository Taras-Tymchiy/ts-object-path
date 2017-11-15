import { ObjPathProxy } from './obj-path-proxy';

const pathSymbol = Symbol('Object path');

export function createProxy<T>(path: string[] = []): ObjPathProxy<T, T> {
  const proxy = new Proxy({[pathSymbol]: path}, {
    get (target, key) {
      return key === pathSymbol
        ? target[pathSymbol]
        : createProxy([...(path || []), key.toString()]);
    }
  });
  return proxy as any as ObjPathProxy<T, T>;
}

export function getPath<TRoot, T>(obj: ObjPathProxy<TRoot, T>): string[] {
  return (obj as any)[pathSymbol];
}

export function isProxy<TRoot, T>(value: any): value is ObjPathProxy<TRoot, T> {
  return value && typeof value === 'object' && !!getPath<TRoot, T>(value as ObjPathProxy<TRoot, T>);
}

