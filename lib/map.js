
// Map (Dictionary) for storing key/value pairs with easy access.
// (c) 2011 Matthew Kitt

// Module dependencies..
var inspect = require('util').inspect

// ## Public API

// Instantiates a Map object with some getter/setters
var Map = module.exports = function Map() {
  this.dict = {}

  this.__defineGetter__('iterator', function() {
    return this.dict
  })

  // size does matter
  this.__defineGetter__('length', function() {
    var count = 0
    for (var _key in this.dict) {
      count += 1
    }
    return count
  })

  // give back all the keys in the map
  this.__defineGetter__('keys', function() {
    var _keys = []
    for (var _key in this.dict) {
      _keys.push(_key)
    }
    return _keys
  })

  // give back all the values in the map
  this.__defineGetter__('values', function() {
    var _values = []

    for (var _key in this.dict) {
      _values.push(this.dict[_key])
    }
    return _values
  })

}

// For pretty printing objects
Map.prototype.toString = function() {
  return inspect(this.dict, true, null)
}

// Get a value from the key argument
Map.prototype.get = function(key) {
  return this.dict[key]
}

// Add a key/value if it doesn't exist already, optionally force it to override if it does exist
Map.prototype.add = function(key, value, force) {
  if (this.hasKey(key) && !force) {
    throw new Error ('key [' + key + '] is already mapped')
  }
  this.dict[key] = value
}

// Remove a key/value based on the key argument
Map.prototype.remove = function(key) {
  var value = this.dict[key]
  delete this.dict[key];
  return value
}

// Check if this map has the existing key
Map.prototype.hasKey = function(key) {
  for (var _key in this.dict) {
    if (_key === key) {
      return true
    }
  }
    return false
}

// Check if this map has the existing value
Map.prototype.hasValue = function(value) {
  for (var key in this.dict) {
    if (this.dict[key] === value) {
      return true
    }
  }
  return false
}

// Find me something based on the function passed through (works great with arrays)
Map.prototype.find = function(fn) {
  for (var key in this.dict) {
    if (fn(key, this.dict[key])) {
      return this.dict[key]
    }
  }
    return null
}

// Do something on each of the items in the map
Map.prototype.each = function(fn) {
  for (var key in this.dict) {
    fn(key, this.dict[key])
  }
}

// Inherit from an existing map
Map.prototype.extend = function(map) {
  var iterator = map.iterator
  for (var key in iterator) {
    this.add(key, iterator[key])
  }
  return this
}

// Combine a couple of maps to make one nice map
Map.prototype.merge = function(map) {
  var iterator = map.iterator
  for (var key in iterator) {
    try {
      this.add(key, iterator[key])
    } catch (err) {}
  }
  return this
}

// Duplicate it sir.
Map.prototype.clone = function() {
  var map = new Map()
  for (var key in this.dict) {
    map.add(key, this.get(key) )
  }
  return map
}


// This is sort of experimental
// It returns a map of 2 maps
// One with same keys and one with different keys
Map.prototype.compareKeys = function(map) {
  var sames = new Map()
  var diffs = new Map()
  var compared = new Map()
  var iterator = map.iterator

  for (var key in iterator) {
    if (this.hasKey(key)) {
      sames.add(key, iterator[key])
    } else {
      diffs.add(key, iterator[key])
    }
  }

  for (var key1 in this.iterator) {
    if (map.hasKey(key1)) {
      try {
        sames.add(key1, this.iterator[key1])
      } catch (err) {}
    } else {
      try {
        diffs.add(key1, this.iterator[key1])
      } catch (e) {}
    }
  }
  compared.add('same', sames)
  compared.add('diff', diffs)
  return compared
}

// Same thing as #compareKeys, except looking at values
Map.prototype.compareValues = function(map) {
  var sames = new Map()
  var diffs = new Map()
  var compared = new Map()
  var iterator = map.iterator

  for (var key in iterator) {
    if (this.hasValue(iterator[key])) {
      sames.add(key, iterator[key])
    } else {
      diffs.add(key, iterator[key])
    }
  }

  for (var key1 in this.iterator) {
    if (map.hasValue(this.iterator[key1])) {
      try {
        sames.add(key1, this.iterator[key1])
      } catch (err) {}
    } else {
      try {
        diffs.add(key1, this.iterator[key1])
      } catch (e) {}
    }
  }
  compared.add('same', sames)
  compared.add('diff', diffs)
  return compared
}

// Clear out all key/values within the map
Map.prototype.clear = function() {
  for (var key in this.dict) {
    delete this.dict[key]
  }
}

// Convenience call to clear
Map.prototype.dispose = function() {
  this.clear()
}

