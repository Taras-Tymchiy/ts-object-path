export interface ObjPath {
  _pathString: string
  _path: string[]
  _name: string
}

export type ObjPathProxy<TRoot, T> = {
  [P in keyof T]: ObjPathProxy<TRoot, Exclude<T[P], undefined>>
} &
  ObjPath
