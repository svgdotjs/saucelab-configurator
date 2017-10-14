// @flow

'use strict'

module.exports = predicateBuilder

const Prelude = require('./lib/Prelude')
const from = require('./lib/from')

let {compose, curry, filter, dot, log, each, map, take, duplicates, sort, removeDuplicates, merge} = from (Prelude)

/**
 * PredicateBuilder
 * @param {string} [platformsPath="./platforms"] optional Absolute path to load platforms from via `require()`
 */
function predicateBuilder(platformsPath = './platforms') {
  const availablePlatforms = require(platformsPath)
  const predicates = []

  // Predicates
  // selectors
  const platforms     = filter(d => !!d.platform || !!d.platformName) // = filter(compose(is, dot('platform')))
  // const platformNames = filter(d => !!d.platformName) // = filter(compose(is, dot('platformName')))
  const browserNames  = filter(d => !!d.browserName) // = filter(compose(is, dot('browserName')))
  const versions      = filter(d => !!d.version) // = only('version') = filter(compose(is, dot('version')))
  // filter helper
  const version   = curry( (v, d)    => d.version.startsWith(v))
  const browser   = curry( (name, d) => d.browserName.toLowerCase().indexOf(name) !== -1 )
  const OS        = curry( (name, d) => {
    let platform = d.platform || d.platformName
    return platform.toLowerCase().indexOf(name) !== -1
  })

  function getAvailablePlatforms() {
    return predicates.length > 0 ? API.exec() : availablePlatforms
  }

  const API = {
    browser(name) {
      // log("browser", name)
      predicates.push(compose(filter(browser(name)), browserNames))
      return this
    },
    get browsers() {
      let ap = getAvailablePlatforms()
      return compose(removeDuplicates, sort, map(lowerCase), map(dot('browserName')))(browserNames(ap))
    },
    platform(name) {
      // log("platform", name)
      predicates.push(compose(filter(OS(name)), platforms))
      return this
    },
    get platforms() {
      let ap = getAvailablePlatforms()

      let plNames = compose(map(dot('platformName')) ,only('platformName'))
      let pl      = compose(map(dot('platform')), only('platform'))
      return compose(removeDuplicates, sort, map(lowerCase), merge(plNames, pl))(ap)
    },
    top(number) {
      predicates.push(take(number))
      return this
    },
    version(v) {
      // log("version", v)
      predicates.push(compose(filter(version(v)), versions))
      return this
    },
    get versions() {
      let ap = getAvailablePlatforms()
      return compose(removeDuplicates, sort, map(dot('version')), versions)(ap)
    },
    exec() {
      return predicates.reduce((a,f) => f(a), availablePlatforms)
    }
  }
/* Doesn't work because API is not re-returned on each invocation of visible API methods
  const secondaryCmds = ['top', 'version', 'versions']
  if(predicates.length === 0) {
    for(let n = 0, len = secondaryCmds.length; n < len; n++)
      delete API[secondaryCmds[n]]
  } */

  return API

/*
  function buildAPI(...methods) {
    // let newAPI = shallowClone(API)
    // // does NOT work
    // each(v => {
    //   if(methods.indexOf(v) === -1) delete newAPI[v]
    // }, API)
    // // does work
    // delete newAPI['platform']
    return newAPI
  }

  function shallowClone(obj) {
    let clone = Object.create({}, Object.getPrototypeOf(obj))

    let props = Object.getOwnPropertyNames(obj)
    props.forEach(function(key) {
      let desc = Object.getOwnPropertyDescriptor(obj, key)
      Object.defineProperty(clone, key, desc)
    })

    return clone
  }

  function define(O, key, value) {
    O[key] || Object["defineProperty"](O, key, {
      writable: true,
      configurable: true,
      value: value
    });
  }
  define(String.prototype, "padLeft", "".padStart);
*/
}

/**
 * Filter to select objects that contain the property,
 * so that the next function doesn't have to deal with undefined values
 * @param {function} property Takes a proterty name that you are intested in querying
 * @return {function}
 */
function only(property) {
  // can be replaced with a Maybe Functor
  return filter(compose(is, dot(property)))
}
function lowerCase(a) {
  return a.toLowerCase()
}
function is(a) {
  return !!a
}
function not(a) {
  return !a
}
// function spread() {
//   return [].splice.call(arguments)
// }


function List() {
  const keys = map(fst)
  const values = map(snd)
  function fst(a) { return a[0] }
  function snd(a) { return a[1] }
}


// diff between partial and curry
// https://github.com/lstrojny/functional-php/blob/master/docs/functional-php.md#currying
// the following doesn't work yet -
/*
function add($a, $b, $c, $d) {
    return $a + $b + $c + $d;
}

let $curriedAdd = curry('add');

let $add10 = $curriedAdd(10);
let $add15 = $add10(5);
let $add42 = $add15(27);
log($add42(10))
 */
