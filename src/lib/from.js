'use strict'

module.exports = from

const Prelude = require('./Prelude')

/**
 * Module loader that curries every exported function.
 * @param {object} module The module name you want to import from. E.I Prelude
 * @return {object} All functions in the module. It's up to you if/how, you want to assign them.
 */
function from(module) {
  let exports = {},
    P = Prelude(),
    each = P.each,
    curry = P.curry,
    assign = f => exports[f.name] = curry(f)

  each(assign, module())

  return exports
}
