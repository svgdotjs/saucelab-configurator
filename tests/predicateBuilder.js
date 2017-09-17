'use strict'

const availablePlatforms = require('../src/platforms')
const Prelude = require('../src/lib/Prelude')
const from = require('../src/lib/from')
const predicateBuilder = require('../src/predicateBuilder')

let log
({log} = from (Prelude))

test()

function test() {
  let expected = [ { base: 'SauceLabs', browserName: 'firefox', version: 'latest' } ]
  let actual

  let predicate = predicateBuilder()
  predicate.browser('firefox')
  actual = predicate.exec()

  is(actual, expected)

  log('⍻ All tests pass')
  process.exit(0)
}

function is(a, b) {
  let testRan = false
  for(let prop in a) {
    if(!Object.prototype.hasOwnProperty.call(a, prop)) continue

    if(a[prop] instanceof Object) is(a[prop], b[prop])
    else if(a[prop] !== b[prop]) throw new Error(`${a[prop]} is not the same as ${b[prop]}`)

    testRan = true
  }
  if(!testRan) throw new Error('No test ran')
  return true
}

// compose(log, removeDuplicates, sort, map(lowerCase), map(dot('browserName')))(predicate.browsers)
// log(predicate.browser('opera')/*.platforms*/)

/*
predicate.test = predicate.browser('opera').version('12').platform('win xp')
predicate.test = predicate.platform('android').browser('android')
predicate.test = predicate.platform('ios').top(1)
predicate.test = predicate.browser('edge').version('latest')
*/

