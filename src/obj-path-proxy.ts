export interface ObjPath {
  _pathUrl: string
  _pathString: string
  _path: string[]
  _name: string
}

export type ObjPathProxy<T> = {
  [P in keyof T]: ObjPathProxy<Exclude<T[P], undefined>>
} &
  ObjPath
