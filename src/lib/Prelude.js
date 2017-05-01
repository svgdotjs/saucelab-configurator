'use strict'

module.exports = Prelude

/**
 * The Prelude module contains all the standard functions.
 */
function Prelude() {
  // Note, that function inside the module are **not** curried.
  return {
    compose,
    composeL,
    curry,
    dot,
    each,
    filter,
    log,
    map,
    take,
    duplicates,
    sort,
    removeDuplicates
  }

  function curry(f) {
    let n = f.length

    // maybe an optimization if(n === 1) return f

    return function partial(...xs) {
      // excessive arguments are ignored
      return n <= xs.length ? f.apply(f, xs) : partial.bind(f, ...xs)
      // we could also throw a type error instead of ignoring, that might be safer and easier to debug
      // if(n < xs.length) throw new TypeError((f.name || 'anonymous') + "does not accept " + xs.length " arguments")
    }
  }
  function compose(...fs) {
    return x => fs.reduceRight((x,a) => a(x), x)
  }
  function composeL(...fs) {
    return x => fs.reduce((x,a) => a(x), x)
  }
  function dot(prop, obj) {
    return obj[prop]
  }
  function each(f, data) {
    for(let n in data)
      f(data[n], n)
  }
  function filter(p, data) {
    let f = []
    each(d => {
      let r = p(d)
      if(r !== false) f.push(d)
    }, data)
    return f
  }
  function log(...args) {
    console.log(...args)
    return args
  }
  function map(f, data) {
    let m = []
    each((v,k) => m.push(f(v, k)), data)
    return m
  }
  function take(n, a, accu = []) {
    if(a.length === 0 || n == 0) return accu
    accu.push(a[0])
    return take( n - 1, a.slice(1), accu ) // tail call
  }
  function sort(a) {
    return Array.prototype.sort.call(a)
  }
  /* elem :: (Eq a) => a -> [a] -> Bool */
  function elem(a, [b,...c]) {
    if(a == b) return true
    if(c.length === 0) return false
    else return elem(a, c)
  }
  /* duplicates :: (Eq a) => [a] -> [a] */
  function duplicates(a) {
    // log("steps",a)
    if(a.length === 0) return a
    let xs = a.slice() // create new array
    let x = xs.shift()
    return elem(x, xs)
      ? [x].concat(duplicates(xs.filter(b => b != x )))
      : duplicates(xs)
  }
  // removeDuplicates :: Eq a => [a] -> [a]
  function removeDuplicates1(a) {
    // log("steps",a)
    if(a.length === 0) return a
    let xs = a.slice()
    let x = xs.shift()
    return elem(x, xs)
      ? removeDuplicates(xs)
      : [x].concat(removeDuplicates(xs))
  }
  // removeDuplicates :: Eq a => [a] -> [a]
  function removeDuplicates2(a) {
    let xs = a.slice()
    let x = xs.shift()
    return xs.reduce(
      (seen, x) => {
        return elem(x, seen) ? seen : seen.concat([x])
      }, [x])
  }
  function removeDuplicates(a) {
    let xs = []
    new Set(a).forEach(x => xs.push(x))
    return xs
  }
  function identity(x) {
    return x
  }
}
