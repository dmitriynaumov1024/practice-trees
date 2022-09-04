Object.prototype.ensureProp = function (propName, predicate) {
  var _this = this
  return {
    or (newValue) {
      if (!predicate(_this[propName])) {
        if (typeof(newValue) == "function") newValue = newValue()
        _this[propName] = newValue
      }
    }
  }
}

export function isString (o) {
  return typeof(o) == "string"
}

export function isNumber (o) {
  return typeof(o) == "number"
}

export function isObject (o) {
  return typeof(o) == "object"
}

export function isArray (o) {
  return o.constructor == Array.prototype.constructor
}

export function isFunction (o) {
  return typeof(o) == "function"
}
