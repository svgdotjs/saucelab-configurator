// @flow

'use strict'

module.exports = predicateBuilder

const availablePlatforms = require('./platforms')
const Prelude = require('./lib/Prelude')
const from = require('./lib/from')

let compose, curry, filter, dot, log, each, map, take, duplicates, sort, removeDuplicates
({compose, curry, filter, dot, log, each, map, take, duplicates, sort, removeDuplicates} = from (Prelude))

// let fstTwo = map(take(2))
// console.log(fstTwo(['jim', 'kate']))

/**
 * PredicateBuilder
 */
function predicateBuilder() {
  const predicates = []

  // Predicates
  // selectors
  const platforms     = filter(d => !!d.platform || !!d.platformName) // filter(compose(is, dot('platform')))
  const platformNames = filter(d => !!d.platformName) // filter(compose(is, dot('platformName')))
  const browserNames  = filter(d => !!d.browserName) // filter(compose(is, dot('browserName')))
  const versions      = filter(d => !!d.version)
  // filter helper
  const version   = curry( (v, d)    => d.version.startsWith(v))
  const browser   = curry( (name, d) => d.browserName.toLowerCase() === name )
  const OS        = curry( (name, d) => {
    let platform = d.platform || d.platformName
    return platform.toLowerCase().indexOf(name) !== -1
  })
  // filter
  const chrome    = browser('chrome')
  const IE        = browser('internet explorer')
  const edge      = browser('microsoftedge')
  const FF        = browser('firefox')
  const android   = browser('android')
  const safari    = browser('safari')
  const opera     = browser('opera')

  const WIN       = OS('windows')
  const ios       = d => d.platformName.toLowerCase().indexOf('ios') !== -1
  //const pliOS     = compose(filter(compose(d => d.indexOf('ios') !== -1, lowerCase, dot('platformName'))), only('platformName'))
  const plmac     = d => d.platform.toLowerCase().indexOf('macos') !== -1 || d.platform.toLowerCase().indexOf('os x') !== -1
  // const plmac2    = compose(filter(compose(d => d.indexOf('macos') !== -1 || d.indexOf('os x') !== -1, lowerCase, dot('platform'))), filter(compose(is, dot('platform'))))
  // log(plmac2(availablePlatforms))
  // const below10 = filter(compose(d => d < 10, dot('version')))

  const mac       = compose(filter(plmac), platforms)
  const platformAndroid = compose(filter(d => d.platformName.toLowerCase().indexOf('android') !== -1), platformNames)(availablePlatforms)

  let safariPlatforms = compose(filter(safari) , platforms)

  /*log( compose(filter(android), browserNames)(availablePlatforms) )
  let wins  = compose(filter(WIN), platforms)(availablePlatforms)
  let ioses = compose(filter(ios), platformNames)(availablePlatforms)
  let macs  = mac(availablePlatforms)
  log( wins, ioses, macs, platformAndroid )

  log(mac(availablePlatforms)[0] === macs[0]) // referencial transparency*/

  let previousExpressions = new Set()

  const API = {
    browser(name) {
      // log("browser", name)
      predicates.push(compose(filter(browser(name)), browserNames))
      // previousExpressions.add(browserNames)
      return this
      //return buildAPI(API.version)
    },
    get browsers() {
      // previousExpressions.clear()
      return compose(removeDuplicates, sort, map(lowerCase), map(dot('browserName')))(browserNames(availablePlatforms))
    },
    platform(name) {
      // log("platform", name)
      predicates.push(compose(filter(OS(name)), platforms))
      return this
    },
    get platforms() {
      previousExpressions.clear()
      return safariPlatforms(availablePlatforms)//platforms(availablePlatforms)
    },
    version(v) {
      // log("version", v)
      predicates.push(compose(filter(version(v)), versions))
      return this
    },
    top(number) {
      predicates.push(take(number))
      return this
    },
    exec() {
      return predicates.reduce((a,f) => f(a), availablePlatforms)
    }
    // set test(p) {
    //   predicates.push(p)
    // },
    // get test() {
    //   return predicates.reduce((a,f) => f(a), availablePlatforms)
    // }
  }

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

let predicate = predicateBuilder()
//TODO: move all tests to tests/predicateBuilder.js
// compose(log, removeDuplicates, sort, map(lowerCase), map(dot('browserName')))(predicate.browsers)
// log(predicate.browser('opera')/*.platforms*/)
/*
predicate.test = predicate.browser('opera').version('12').platform('win xp')
predicate.test = predicate.platform('android').browser('android')
predicate.test = predicate.platform('ios').top(1)
predicate.test = predicate.browser('edge').version('latest')
*/

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
