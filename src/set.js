"use strict";

function Set(iterable) {

  this._set = removeDuplicates(Array.prototype.concat.apply([], iterable));
  this.length = 0;

  function removeDuplicates(a) {
    var xs = a.slice();
    var x = xs.shift();
    return xs.reduce(function (seen, x) {
      return seen.indexOf(x) !== -1 ? seen : seen.concat([x]);
    }, [x]);
  }
}
Object.defineProperties(
  Set.prototype,
  {
    '_set': {
      writable: true,
      configurable: false,
      enumerable: false
    },
    'length': {
      writable: true,
      configurable: false,
      enumerable: false
    },
    'size': {
      get: function() { return this._set.length; }
    },
    'add': {
      value: function add(value) {
        this._set.push(value);
        return this;
      }
    },
    'clear': {
      value: function clear() {
        this._set = [];
      }
    },
    'delete': {
      value: function _delete(value) {
        if (this.has(value)) {
          this._set.splice(this._set.indexOf(value), 1);
          return true;
        } else return false;
      }
    },
    'entries': {
      value: function entries() {
        var es = [];
        this.forEach(function (value) {
          es.push([value, value]);
        });
        return es;
      }
    },
    'forEach': {
      value: function forEach(f, context) {
        this._set.forEach(f, context);
      }
    },
    'has': {
      value: function has(value) {
        return this._set.indexOf(value) !== -1;
      }
    },
    'values': {
      value: function values() {
        var values = [];
        this.forEach(function (k) {
          values.push(k);
        });
        return values;
      }
    },
    'keys': {
      value: function keys() {
        return this.values();
      }
    }
  }
);

function main() {
  var l = console.log
  var set = new Set(arguments)
  l(set.size, set.length)
  l(set.add(4))
  l(set.clear())
  l(set.add(2).add("mlæ"))
  l(set.has(2), set.has("NKl"))
  l(set.delete(2), set.delete(set), set)
  l(set.entries())
  l(set.values())
  l(set.keys())
}

main(1,2,3)
