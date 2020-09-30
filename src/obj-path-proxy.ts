export interface ObjPath {
  _path: string
  _name: string
}

export type ObjPathProxy<TRoot, T> = {
  [P in keyof T]: ObjPathProxy<TRoot, T[P]>
} &
  ObjPath
