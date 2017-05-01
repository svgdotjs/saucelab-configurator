'use strict'

module.exports = Functors

/**
 * Usage: let Maybe
 * ({Maybe} = from (Functors))
 * @return {function}
 */
function Functors() {

  return { fmap, Maybe }

  const identity = x => x

  function fmap(F, f) {
    return F.map(x => f(x))
  }
  function Maybe(val) {
    this.val = val
  }
  Maybe.prototype.map = function(f) {
    return this.val == null ? Maybe(f(this.val)) : Maybe(null)
  }

  function unbox() {
    return this.fmap(identity)
  }
}
