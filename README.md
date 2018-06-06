## flow-type-complexity

[![npm](https://img.shields.io/npm/v/flow-type-complexity.svg)](https://www.npmjs.com/package/flow-type-complexity)
[![node](https://img.shields.io/node/v/flow-type-complexity.svg)](https://github.com/Bannerets/flow-type-complexity)

Calculates complexity of each [Flow](https://flow.org/) type alias in a file.  

### Installation

```console
$ [sudo] npm install -g flow-type-complexity
```

### Usage

```console
$ flow-type-complexity <filename>
```

By default, only 5 types with the greatest complexity are showing.  
To see complexity of all types, use option `-a` (or `--show-all`).

See `help`:

```console
$ flow-type-complexity --help
```

### Examples

`1.js`:

```typescript
// @flow
export type TypeA = 5 | TypeB
type TypeB = { a: number, b: 2, c: null }
type TypeC = {
  d: 4,
  b: TypeB
}
```

```console
$ flow-type-complexity 1.js
```

Output:
```
TypeA: { unions: 1, primitives: 4 }
TypeC: { unions: 0, primitives: 4 }
TypeB: { unions: 0, primitives: 3 }
```

---

`2.js`:

```typescript
// @flow
type TypeA = { a: 2 } | void
type TypeB = { a: TypeA } | { b: 2 } | { c: null }
type TypeC = { d: 4, b: TypeB }
type TypeD = { a: string, c: TypeC | 'str', b: any }
type TypeE = { a: mixed, d: TypeD }
type TypeF = { e: TypeE, x: number }
```

```console
$ flow-type-complexity 2.js
```

Output:
```
TypeF: { unions: 4, primitives: 10 }
TypeE: { unions: 4, primitives: 9 }
TypeD: { unions: 4, primitives: 8 }
TypeC: { unions: 3, primitives: 5 }
TypeB: { unions: 3, primitives: 4 }
```

With `show-all`:

```console
$ flow-type-complexity 2.js --show-all
```

Output:
```
TypeF: { unions: 4, primitives: 10 }
TypeE: { unions: 4, primitives: 9 }
TypeD: { unions: 4, primitives: 8 }
TypeC: { unions: 3, primitives: 5 }
TypeB: { unions: 3, primitives: 4 }
TypeA: { unions: 1, primitives: 2 }
```
