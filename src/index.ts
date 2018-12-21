/**
 * Simple (read mildly naive) implementation of a Binary Search Tree
 * @module BTree
 * @author Simon Leigh
 */
import { Maybe, isNone, None, Some, unwrap, andThen, map as map_maybe, isSome, withDefault } from "maybe-none"

export type BTree<K, T> = Maybe<BTNode<K, T>>

type BTNode<K, T> = {
  key: K,
  value: T
  left: BTree<K, T>
  right: BTree<K, T>
}

type empty = () => BTree<any, any>
type singleton = <K, T>(key: K) => (value: T) => BTree<K, T>
type insert = <K>(key: K) => <T>(value: T) => (tree: BTree<K, T>) => BTree<K, T>
type get = <K>(key: K) => <T>(tree: BTree<K, T>) => Maybe<T>
type _get = <K>(key: K) => <T>(node: BTNode<K, T>) => Maybe<T>
type remove = <K>(key: K) => <T>(tree: BTree<K, T>) => BTree<K, T>
type _remove = <K>(key: K) => <T>(tree: BTNode<K, T>) => BTree<K, T>
type fold = <K, T, U>(fn: (key: K, value: T, acc: U) => U) => (start: U) => (tree: BTree<K, T>) => U
type map = <K, T, U>(fn: (key: K, value: T) => U) => (tree: BTree<K, T>) => BTree<K, U>


/**
 * Create an empty Tree
 */
export const empty: empty = () => None()


/**
 * Create a Tree with a single key, value pair
 */

export const singleton: singleton
  = key => value => Some(_new_node(key, value, None(), None()))


/**
 * Insert a key, value pair into a Tree
 * Implementation of insert
 * Recurse to correct node and return value
 * None handled by andThen()
 */
export const insert: insert
  = k => v => t => {
    if (isNone(t)) {
      return Some(_new_node(k, v, None(), None()))
    }
    const node = unwrap(t)
    if (k < node.key) {
      return Some(_new_node(node.key, node.value, insert(k)(v)(node.left), node.right))
    }
    if (k > node.key) {
      return Some(_new_node(node.key, node.value, node.left, insert(k)(v)(node.right)))
    }
    return t
  }


/**
* Get the value of a node from Tree with it's key
*/
export const get: get = k => andThen(_get(k))


/**
 * Implementation of get
 * Recurse to correct node and return value
 * None handled by andThen()
 */
const _get: _get
  = k => n => {
    if (k < n.key) {
      return get(k)(n.left)
    }
    if (k > n.key) {
      return get(k)(n.right)
    }
    return Some(n.value)
  }


/**
 * Remove element from Tree, returning a new BTree
 */
export const remove: remove = k => andThen(_remove(k))


/**
 * Implementation of remove
 * Recurse to correct node
 * -> if both child nodes set "replace" with deepest node on right branch (R)
 *    by returning new node with key and val of R, left of node's left
 *    and right of node's right - R
 * -> if only one child set "replace" by returning child node
 * -> if no children unset by returning None
 */
const _remove: _remove
  = k => n => {
    if (k < n.key) {
      return Some(_new_node(n.key, n.value, remove(k)(n.left), n.right))
    }
    if (k > n.key) {
      return Some(_new_node(n.key, n.value, n.left, remove(k)(n.right)))
    }
    if (isSome(n.left) && isSome(n.right)) {
      const replacement = _min_node(unwrap(n.right))
      const newRight = remove(replacement.key)(n.right)
      return Some(_new_node(replacement.key, replacement.value, n.left, newRight))
    }
    if (isSome(n.left) ) {
      return n.left
    }
    if (isSome(n.right)) {
      return n.right
    }
    return None()
  }


/**
 * Fold across a Tree from left to right (lowest to highest)
 */
export const foldl: fold
  = fn => a => t => {
    if (isNone(t)) {
      return a
    }
    const node = unwrap(t)
    return foldl(fn)(fn(node.key, node.value, foldl(fn)(a)(node.left)))(node.right)
  }


/**
 * Fold across a Tree from right to left (highest to lowest)
 */
export const foldr: fold
= fn => a => t => {
  if (isNone(t)) {
    return a
  }
  const node = unwrap(t)
  return foldr(fn)(fn(node.key, node.value, foldr(fn)(a)(node.right)))(node.left)
}


/**
 * Map a Tree converting the values of key, value pairs.
 * Returns a new Tree
 */
export const map: map
= fn => map_maybe(node => {
    const left = map(fn)(node.left)
    const val = fn(node.key, node.value)
    const right = map(fn)(node.right)
    return _new_node(node.key, val, left, right)
  })


// HELPERS

type _new_node = <K, T>(key: K, value: T, left: BTree<K, T>, right: BTree<K, T>) => BTNode<K, T>
const _new_node: _new_node
= (key, value, left, right) => {
  return { 
    key: key,
    value: value,
    left: left,
    right: right
  }
}


type _min_node = <K, T>(node: BTNode<K, T>) => BTNode<K, T>
const _min_node: _min_node
  = n =>  withDefault(n)(n.left)