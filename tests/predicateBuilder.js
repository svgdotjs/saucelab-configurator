'use strict'

// const availablePlatforms = require('../src/platforms')
const Prelude = require('../src/lib/Prelude')
const from = require('../src/lib/from')
const predicateBuilder = require('../src/predicateBuilder')

let log, each
({log, each} = from (Prelude))

const test = testBuilder()
function testBuilder() {
  const startTime = Date.now()
  const tests = []
  let timer, hadError = false
  return function test(desc, f) {
    tests.push({desc, f})
    clearTimeout(timer)
    timer = setTimeout(() => {

      each((d, n) => {
        if(d) {
          log(`Running test: ${d.desc}`)
          try {
            d.f()
          } catch(err) {
            console.warn(err)
            hadError = true
          }
          tests[n] = null
        }
      }, tests)

      if(!hadError && tests.every(t => t === null)) {
        log(`\n⍻ All tests pass (${Date.now() - startTime}ms)`)
        process.exit(0)
      } else if(hadError) {
        process.exit(1)
      }

    }, 0)
  }
}

test('predicate.browser', () => {
  test('Firefox', () => {
    let actual
    let expected = [ { base: 'SauceLabs', browserName: 'firefox', version: 'latest' } ]

    let predicate = predicateBuilder()
    predicate.browser('firefox')
    actual = predicate.exec()

    compare(actual, expected)
  })

  test('Opera', () => {
    let actual
    let expected = [{
        base: 'SauceLabs',
        browserName: 'opera',
        platform: 'Linux',
        version: '12.15'
      },
      {
        browserName: 'opera',
        platform: 'Windows XP',
        version: '11.64',
        base: 'SauceLabs'
      },
      {
        browserName: 'opera',
        platform: 'Windows 7',
        version: '12.12',
        base: 'SauceLabs'
      }
    ]

    let predicate = predicateBuilder()
    predicate.browser('opera')
    actual = predicate.exec()

    compare(actual, expected)
  })

  test('Opera 11.64 on WinXP', () => {
    let actual
    let expected = [{
      browserName: 'opera',
      platform: 'Windows XP',
      version: '11.64',
      base: 'SauceLabs'
    }]

    let predicate = predicateBuilder()
    predicate.browser('opera').version('11').platform('windows')
    actual = predicate.exec()

    compare(actual, expected)
  })
})


// compose(log, removeDuplicates, sort, map(lowerCase), map(dot('browserName')))(predicate.browsers)
// log(predicate.browser('opera')/*.platforms*/)

/*
predicate.test = predicate.browser('opera').version('12').platform('win xp')
predicate.test = predicate.platform('android').browser('android')
predicate.test = predicate.platform('ios').top(1)
predicate.test = predicate.browser('edge').version('latest')
*/


function compare(a, b) {
  let testRan = false
  for(let prop in a) {
    if(!Object.prototype.hasOwnProperty.call(a, prop)) continue

    if(a[prop] instanceof Object) compare(a[prop], b[prop])
    else if(a[prop] !== b[prop]) throw new Error(`${a[prop]} is not the same as ${b[prop]}`)

    testRan = true
  }
  if(!testRan) throw new Error('No test ran')
  return true
}