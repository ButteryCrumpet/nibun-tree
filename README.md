Nibun-tree
==========

Nibun-tree is a functional implementation of a `Binary Search Tree` in Typescript. \
All functions are curried and return a new `BTree`. \

# Documentation

Remember to import the module \

```typescript

import * as Tree from "nibun-tree"

```

## Trees and Nodes

Nibun-tree's `BTree<K, T>` type, where `K` is the type of key and `T` is \
the type of data, is implemented as a `Maybe<BNode<K,T>>`. \
As such a tree may be empty, represented as a `None` type. \

```typescript

type BTree<K, T> = Maybe<BTNode<K, T>>

type BTNode<K, T> = {
  key: K,
  value: T
  left: BTree<K, T>
  right: BTree<K, T>
}

```

## Operations

### empty

Creates an empty tree. \

```typescript
type empty = () => BTree<any, any>

const emptyTree = Tree.empty()

```

### singleton

Creates a tree with a single node. \

```typescript
type singleton = <K, T>(key: K) => (value: T) => BTree<K, T>

const tree = Tree.singleton(10)("value") // BTree<number, string>

```

### insert

Insert a new value into tree returning a new `BTree<K, T>`. \

```typescript
type insert = <K>(key: K) => <T>(value: T) => (tree: BTree<K, T>) => BTree<K, T>

const insertStuff = Tree.insert(10)("value")
const tree = insertStuff(Tree.empty())

```

### get

Gets a value in the form of a `Maybe<T>` from a tree using a key. \
Returns `Some<T>` if key exists, else a `None` \

```typescript
type get = <K>(key: K) => <T>(tree: BTree<K, T>) => Maybe<T>

const getKeyOne = Tree.get(1)
const tree = Tree.singleton(1)("value")
const value = getKeyOne(tree) // Some<string> "value"

const getKeyTwo = Tree.get(2)
const value2 = getKeyTwo(tree) // None

```

### remove

Removes a value from a tree returning a new `BTree<K, T>` \

```typescript
type remove = <K>(key: K) => <T>(tree: BTree<K, T>) => BTree<K, T>

const removeKeyTen = Tree.remove(10)
const tree = Tree.singleton(10)("value")
const newTree = removeKeyTen(tree)

```

### foldl

Folds over a tree from left to right (smallest to largest) \

```typescript
type fold = <K, T, U>(fn: (key: K, value: T, acc: U) => U) => (start: U) => (tree: BTree<K, T>) => U

const sumFold = (key: number, _value: any, acc: number) => acc + key
const sumKeys = Tree.foldl(sumKeys)(0)
const result = sumKeys(tree) // number


```

### foldr

Folds over a tree from right to left (highest to smallest). \
Use is identical to foldl.

### map

Maps over a `BTree<K, T>` with a function and returns a `BTree<K, U>`

```typescript
type map = <K, T, U>(fn: (key: K, value: T) => U) => (tree: BTree<K, T>) => BTree<K, U>

const extractName = (key: number, value: {name: string, age: string}) => value.name
const names = Tree.map(extractName)(tree) // BTree<number, string>

```

# Notes

`Maybe<T>` implementation used by this package can be found [here](https://www.npmjs.com/package/maybe-none) \
It is heavily inspired by Elm's Maybe implementation. \
Effective use of Maybe.map and Maybe.andThen makes working with Maybe's \
and so Nibun-tree a lot easier.