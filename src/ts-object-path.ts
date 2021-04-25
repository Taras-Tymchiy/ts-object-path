import { ObjPathProxy } from './obj-path-proxy'
export * from './obj-path-proxy'

const pathSymbol = Symbol('Object path')

type RecursiveRequired<T> = {
  [P in keyof T]-?: RecursiveRequired<T[P]>;
};

export function createProxy<T>(path: PropertyKey[] = []): ObjPathProxy<RecursiveRequired<T>> {
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
          return path.join('.')
        }
        if(key === '_url'){
          return path.join('/')
        }
        if (key === '_name') {
          return path[path.length - 1]
        }

        let keys: (string | symbol)[] = []

        if (typeof key === 'string') {
          keys = key.split('.')
        }
        return createProxy([...(path || []), ...keys.map((key) => {
          let newKey: string | symbol | number  = key;
          const intKey = parseInt(key.toString(), 10)
          if (key === intKey.toString()) {
            newKey = intKey
          }
          return newKey;
        })])
      }
    }
  )
  return (proxy as any) as ObjPathProxy<RecursiveRequired<T>>
}


export function get<T>(
  object: any,
  proxy: ObjPathProxy<T>,
  defaultValue: T | null | undefined = undefined
) {
  return proxy._path.reduce((o, key) => (o && o[key]) || defaultValue, object as any) as T | undefined
}

export function set<T>(object: any, proxy: ObjPathProxy<T>, value: T): void {
  proxy._path.reduce((o: any, key, index, keys) => {
    if (index < keys.length - 1) {
      o[key] = o[key] || (typeof keys[index + 1] === 'number' ? [] : {})
      return o[key]
    }
    o[key] = value
  }, object)
}
