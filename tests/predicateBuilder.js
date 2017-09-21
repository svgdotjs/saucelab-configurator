'use strict'

const Prelude = require('../src/lib/Prelude')
const from = require('../src/lib/from')
const predicateBuilder = require('../src/predicateBuilder')

let map, log, each, repeat
({map, log, each, repeat} = from (Prelude))

const QUIETE = map((a => a === '-q' | a === '--quiet'), process.argv).some(x => x)
const test = testBuilder()
function testBuilder() {
  const startTime = Date.now()
  const tests = []
  let timer, hadError = false, indent = 0

  return function test(desc, f) {
    // TODO: turn below logic into a composition of functions
    tests.push({desc, f})
    clearTimeout(timer)
    timer = setTimeout(() => {

      each((d, n) => {
        if(d) {

          if(!QUIETE) log(`${repeat(indent, '\t')}Running: ${d.desc}`)

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
        if(!QUIETE) log(`\n⍻ All tests pass (${Date.now() - startTime}ms)`)
        process.exit(0)
      } else if(hadError) {
        process.exit(1)
      }

      indent++

    }, 0)
  }
}

const testFixture = __dirname + '/fixture/platforms'


test('Prepare predicate.browser', () => {
  test('test predicate.browser("firefox")', () => {
    let actual
    let expected = [
      { browserName: 'firefox', version: 'latest', base: 'SauceLabs' },
      { browserName: 'firefox', version: '55.0', platform: 'Windows 10', base: 'SauceLabs' }
    ]

    let predicate = predicateBuilder(testFixture)
    predicate.browser('firefox')
    actual = predicate.exec()
    compare(actual, expected)
  })

   test('test predicate.browser("opera")', () => {
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

    let predicate = predicateBuilder(testFixture)
    predicate.browser('opera')
    actual = predicate.exec()

    compare(actual, expected)
  })

  test('test predicate.browser("opera").version("11").platform("windows") (Opera 11.64 on WinXP)', () => {
    let actual
    let expected = [{
      browserName: 'opera',
      platform: 'Windows XP',
      version: '11.64',
      base: 'SauceLabs'
    }]

    let predicate = predicateBuilder(testFixture)
    predicate.browser('opera').version('11').platform('windows')
    actual = predicate.exec()

    compare(actual, expected)
  })

  test('test predicate.browser("microsoftedge").version("latest")', () => {
    let actual
    let expected = [{
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      version: 'latest',
      platform: 'Windows 10'
    }]

    let predicate = predicateBuilder(testFixture)
    predicate.browser('microsoftedge').version('latest')
    actual = predicate.exec()

    compare(actual, expected)
  })
})

test('Prepare predicate.platform', () => {
  test('test predicate.platform("android")', () => {
    let actual
    let expected = [{
      base: 'SauceLabs',
      browserName: 'Android',
      appiumVersion: '1.5.3',
      deviceName: 'Samsung Galaxy S7 Device',
      deviceOrientation: 'portrait',
      platformVersion: '6.0',
      platformName: 'Android'
    }]

    let predicate = predicateBuilder(testFixture)
    predicate.platform('android').browser('android')
    actual = predicate.exec()
    compare(actual, expected)
  })

  test('test predicate.platform("ios")', () => {
    let actual
    let expected = [{
        browserName: 'Safari',
        appiumVersion: '1.6.4',
        deviceName: 'iPhone SE Simulator',
        deviceOrientation: 'portrait',
        platformVersion: '10.2',
        platformName: 'iOS',
        base: 'SauceLabs'
      },
      {
        browserName: 'Safari',
        appiumVersion: '1.6.5',
        deviceName: 'iPhone SE Simulator',
        deviceOrientation: 'portrait',
        platformVersion: '10.3',
        platformName: 'iOS',
        base: 'SauceLabs'
      }
    ]

    let predicate = predicateBuilder(testFixture)
    predicate.platform('ios')
    actual = predicate.exec()
    compare(actual, expected)
  })

  test('test predicate.platform("ios").top(1)', () => {
    let actual
    let expected = [{
      base: 'SauceLabs',
      browserName: 'Safari',
      deviceName: 'iPhone SE Simulator',
      deviceOrientation: 'portrait',
      platformVersion: '10.2',
      platformName: 'iOS',
      appiumVersion: '1.6.4'
    }]

    let predicate = predicateBuilder(testFixture)
    predicate.platform('ios').top(1)
    actual = predicate.exec()

    compare(actual, expected)
  })
})

test('Prepare query tests', () => {
  test('test predicate.browsers', () => {
    let actual
    let expected = [
      'android',
      'chrome',
      'firefox',
      'internet explorer',
      'microsoftedge',
      'opera',
      'safari'
    ]

    let predicate = predicateBuilder(testFixture)
    actual = predicate.browsers

    compare(actual, expected)
  })

  test('test predicate.platform("windows").browsers', () => {
    let actual
    let expected = [ 'firefox', 'internet explorer', 'microsoftedge', 'opera' ]

    let predicate = predicateBuilder(testFixture)
    actual = predicate.platform('windows').browsers

    compare(actual, expected)
  })

  test('test predicate.platforms', () => {
    let actual
    let expected = [
      'android',
      'ios',
      'linux',
      'macos 10.12',
      'os x 10.11',
      'windows 10',
      'windows 7',
      'windows xp'
    ]

    let predicate = predicateBuilder(testFixture)
    actual = predicate.platforms

    compare(actual, expected)
  })

  test('test predicate.browser("safari").platforms', () => {
    let actual
    let expected = [ 'ios', 'macos 10.12', 'os x 10.11' ]

    let predicate = predicateBuilder(testFixture)
    actual = predicate.browser('safari').platforms

    compare(actual, expected)
  })
})

/*
query for all available browsers:
compose(log, removeDuplicates, sort, map(lowerCase), map(dot('browserName')))(predicate.browsers)
query for all Opera browsers that has the field platform or platformName
log(predicate.browser('opera').platforms)
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
