// @flow

module.exports = ([
  //  * Real mobile devices are not available
  //  * with browserName: 'Android', I get
  //  *  Your account does not have access to Android devices.
  //  *  Please contact sales@saucelabs.com to add this feature to your account.
  //  * AND with browserName: 'Chrome', I get
  //  *  No app defined; we do not have enough information to run your test.
  //  *  If you need help setting up test parameters, please
  //  *  visit https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
{
  browserName: 'Android',
  appiumVersion: '1.5.3',
  deviceName: 'Samsung Galaxy S7 Device',
  deviceOrientation: 'portrait',
  // browserName: 'Chrome',
  platformVersion: '6.0',
  platformName: 'Android'
}, {
  browserName: 'Android',
  deviceName: 'Android Emulator',
  deviceOrientation: 'portrait'
}, {
  browserName: 'firefox',
  version: 'latest',
  base: 'SauceLabs'
}, {
  browserName: 'chrome',
  version: 'latest'
}, {
  browserName: 'MicrosoftEdge',
  version: 'latest',
  platform: 'Windows 10'
}, {
  browserName: 'firefox',
  version: '55.0',
  platform: 'Windows 10'
}, {
  browserName: 'safari',
  platform: 'macOS 10.12',
  version: '10.0'
}, {
  browserName: 'Safari',
  appiumVersion: '1.6.4',
  deviceName: 'iPhone SE Simulator',
  deviceOrientation: 'portrait',
  platformVersion: '10.2',
  platformName: 'iOS'
}, {
  browserName: 'Safari',
  appiumVersion: '1.6.5',
  deviceName: 'iPhone SE Simulator',
  deviceOrientation: 'portrait',
  platformVersion: '10.3',
  platformName: 'iOS'
}, {
  browserName: 'internet explorer',
  platform: 'Windows XP',
  version: '6.0'
}, {
  browserName: 'safari',
  platform: 'OS X 10.11',
  version: '9.0'
}, {
  browserName: 'opera',
  platform: 'Linux',
  version: '12.15'
}, {
  browserName: 'opera',
  platform: 'Windows XP',
  version: '11.64',
}, {
  browserName: 'opera',
  platform: 'Windows 7',
  version: '12.12',
}
]).map(x => {
  x.base ? x.base : x.base = 'SauceLabs'
  return x
})
