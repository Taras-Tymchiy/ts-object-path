import { ObjPathProxy } from './obj-path-proxy'
export * from './obj-path-proxy'

const pathSymbol = Symbol('Object path')

type RecursiveRequired<T> = {
  [P in keyof T]-?: RecursiveRequired<T[P]>;
};

export function createProxy<T>(path: PropertyKey[] = []): ObjPathProxy<T, RecursiveRequired<T>> {
  const proxy = new Proxy(
    { [pathSymbol]: path },
    {
      get(target, key) {
        if (key === pathSymbol) {
          return target[pathSymbol]
        }
        if (key === '_path') {
          return path
        }
        if (key === '_pathString') {
          return path.join('/')
        }
        if (key === '_name') {
          return path[path.length - 1]
        }
        if (typeof key === 'string') {
          const intKey = parseInt(key, 10)
          if (key === intKey.toString()) {
            key = intKey
          }
        }
        return createProxy([...(path || []), key])
      }
    }
  )
  return (proxy as any) as ObjPathProxy<T, RecursiveRequired<T>>
}


export function get<TRoot, T>(
  object: TRoot,
  proxy: ObjPathProxy<TRoot, T>,
  defaultValue: T | null | undefined = undefined
) {
  return proxy._path.reduce((o, key) => (o && o[key]) || defaultValue, object as any) as T
}

export function set<TRoot, T>(object: TRoot, proxy: ObjPathProxy<TRoot, T>, value: T): void {
  proxy._path.reduce((o: any, key, index, keys) => {
    if (index < keys.length - 1) {
      o[key] = o[key] || (typeof keys[index + 1] === 'number' ? [] : {})
      return o[key]
    }
    o[key] = value
  }, object)
}
