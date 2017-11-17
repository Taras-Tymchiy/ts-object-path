# ts-object-path
Generate strongly-typed deep property path in typescript. Access deep property by a path.

[![npm version](https://badge.fury.io/js/ts-object-path.svg)](https://badge.fury.io/js/ts-object-path)

## Install
```
npm install ts-object-path --save
```

## Usage

### Get property path
```typescript
import { createProxy, getPath } from 'ts-object-path'

interface IExample {
  one: number;
  two: string;
  nested: IExample;
  collection: IExample[];
}

const p = createProxy<IExample>();

getPath(p.one); // returns ['one']
getPath(p.nested.one); // returns ['nested', 'one']
getPath(p.collection[5].nested.two); // returns ['collection', 5, 'nested', 'two']
getPath(p.three); // compilation error (no such property)

```

### Get deep property value
```typescript
import { get } from 'ts-object-path'

interface IExample {
  one?: number;
  two?: string;
  nested?: IExample;
  collection?: IExample[];
}

const o: IExample = {
  one: 777;
  collection: [
    null,
    { two: 'Hello' }
  ]
};

get(o, p=> p.one); // returns 777
get(o, p=> p.nested.one); // returns undefined
get(o, p=> p.collection[1].two); // returns 'Hello'
get(o, p=> p.collection[0].two, 'default'); // returns 'default'
get(o, p=> p.collection[0].one, 'default'); // compilation error (property and default value types don't match)
get(o, p=> p.three); // compilation error (no such property)
const val: number = get(o, p=> p.collection[1].two); // compilation error (string is not assignable to number)

```

### Set deep property value
```typescript
import { set } from 'ts-object-path'

interface IExample {
  one?: number;
  two?: string;
  nested?: IExample;
  collection?: IExample[];
}

const o: IExample = {
  one: 1;
};

set(o, p=> p.one, 777); // o === { one: 777 }
set(o, p=> p.nested.one, 3); // o === { one: 777, nested: { one: 3 } }
set(o, p=> p.collection[1].two, 'hello'); // o === { one: 777, nested: { one: 3 }, collection: [undefined, { two: 'hello'}] }

```
