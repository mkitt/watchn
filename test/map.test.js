
var Map = require('map')
var assert = require('assert')
var map

function before() {
  try {
    map.dispose()
    map = null
  } catch (err) {}
  map = new Map()
}

function populate() {
  map.add('key_0', 'value_0')
  map.add('key_1', 'value_1')
  map.add('key_2', 'value_2')
  map.add('key_3', 'value_3')
  map.add('key_4', 'value_4')
}

module.exports = {

  'test #constructor': function() {
    before()
    assert.eql(map.length, 0)
  },

  'test #toString': function() {
    before()
    map.add( 'key_0', 'value_0' )
    map.add( 'key_1', 'value_1' )
    assert.includes(map.toString(), 'value_1')
  },

  'test .iterator': function() {
    before()
    assert.eql(map.dict, map.iterator)
  },

  'test .length': function() {
    before()
    assert.eql(map.length, 0)
    populate()
    assert.eql(map.length, 5)
  },

  'test .keys': function() {
    before()
    populate()
    var keys = map.keys
    assert.eql(keys.length, map.length)
    assert.includes(keys, 'key_1')
    assert.includes(keys, 'key_2')
    assert.includes(map.keys, 'key_4')
  },

  'test .values': function() {
    before()
    populate()
    var values = map.values
    assert.eql(values.length, map.length)
    assert.includes(values, 'value_1')
    assert.includes(values, 'value_2')
    assert.includes(values, 'value_4')
  },

  'test #get': function() {
    before()
    populate()
    assert.eql(map.get('key_1'), 'value_1')
    assert.eql(map.get('key_2'), 'value_2')
    assert.notDeepEqual(map.get('key_3'), 'value_1')
  },

  'test #add': function() {
    before()
    map.add( 'key_0', 'value_0' )
    map.add( 'key_1', 'value_1' )
    map.add( 'key_2', 'value_2' )
    assert.eql(map.length, 3)
    assert.ok(map.hasKey('key_0'))
    assert.ok(map.hasKey('key_1'))
    assert.ok(map.hasKey('key_2'))
  },

  'test #remove': function() {
    before()
    populate()
    var value = map.remove('key_2')
    assert.eql(value, 'value_2')
    assert.eql(map.hasKey('key_2'), false)
  },

  'test #hasKey': function() {
    before()
    populate()
    assert.ok(map.hasKey('key_0'))
    assert.ok(map.hasKey('key_1'))
    assert.ok(map.hasKey('key_2'))
  },

  'test #hasValue': function() {
    before()
    populate()
    assert.ok(map.hasValue('value_0'))
    assert.ok(map.hasValue('value_1'))
    assert.ok(map.hasValue('value_2'))
  },

  'test #find': function() {
    before()
    populate()

    var found = map.find(function(key, value) {
      if( key === 'key_0' && value === 'value_0' )
        return true;
      return false;
    })

    var notfound = map.find(function(key, value) {
      if( key === 'key_8' && value === 'value_8' )
        return true;
      return false;
    })

    assert.ok(found)
    assert.isNull(notfound)
  },

  'test #each': function() {
    before()
    populate()
    var values = []
    map.each(function(key, value) {
      values.push(value)
    })
    assert.includes(values, 'value_0')
  },

  'test #extend': function() {
    var map1 = new Map()
    var map2 = new Map()

    map1.add('map1_key1', 'map1_value1')
    map1.add('map1_key2', 'map1_value2')
    map2.add('map2_key1', 'map2_value1')
    map2.add('map2_key2', 'map2_value2')

    var extended = map1.extend(map2)

    assert.ok(extended.hasKey('map1_key1'))
    assert.ok(extended.hasKey('map1_key2'))
    assert.ok(extended.hasKey('map2_key1'))
    assert.ok(extended.hasKey('map2_key2'))

    assert.ok(extended.hasValue('map1_value1'))
    assert.ok(extended.hasValue('map1_value2'))
    assert.ok(extended.hasValue('map2_value1'))
    assert.ok(extended.hasValue('map2_value2'))
  },

  'test #merge': function() {
    var map1 = new Map()
    var map2 = new Map()
    map1.add('map1_key1', 'map1_value1')
    map2.add('map2_key1', 'map2_value1')

    map1.add('same1_key', 'same1_value')
    map2.add('same1_key', 'same1_value')
    map1.add('same2_key', 'diff1_value')
    map2.add('same2_key', 'diff2_value')

    map1.merge(map2)
    assert.eql(map1.length, 4)
    assert.ok(map1.hasKey('map1_key1'))
    assert.ok(map1.hasKey('map2_key1'))
    assert.ok(map1.hasKey('same1_key'))
    assert.ok(map1.hasKey('same2_key'))

    assert.ok(map1.hasValue('diff1_value'))
    assert.eql(map1.hasValue('diff2_value'), false)
  },

  'test #clone': function() {
    before()
    populate()
    var map2 = map.clone()
    assert.ok(map2.hasKey, 'key_0')
    assert.ok(map2.hasKey, 'key_2')
    assert.ok(map2.hasValue, 'value_3')
    assert.ok(map2.hasValue, 'value_4')
  },

  // experimental..
  'test #compareKeys': function() {
    var map1 = new Map()
    var map2 = new Map()
    map1.add('diff1_key', 'diff1_value')
    map2.add('diff2_key', 'diff2_value')
    map1.add('same1_key', 'same1_value')
    map2.add('same1_key', 'same1_value')
    map1.add('same2_key', 'same1_value')
    map2.add('same2_key', 'same1_value')

    var compared = map1.compareKeys(map2)
    var same = compared.get('same')
    var diff = compared.get('diff')
    assert.eql(compared.length, 2)
    assert.eql(same.length, 2)
    assert.eql(diff.length, 2)

    assert.ok(diff.hasKey('diff1_key'))
    assert.ok(same.hasKey('same1_key'))

    assert.eql(diff.hasKey('same1_key'), false)
    assert.eql(same.hasKey('diff1_key'), false)
  },

  // experimental..
  'test #compareValues': function() {
    var map1 = new Map()
    var map2 = new Map()
    map1.add('diff1_key', 'diff1_value')
    map2.add('diff2_key', 'diff2_value')
    map1.add('same1_key', 'same1_value')
    map2.add('same1_key', 'same1_value')

    var compared = map1.compareValues(map2)
    var same = compared.get('same')
    var diff = compared.get('diff')
    assert.eql(compared.length, 2)
    assert.eql(same.length, 1)
    assert.eql(diff.length, 2)

    assert.ok(diff.hasValue('diff1_value'))
    assert.ok(same.hasValue('same1_value'))

    assert.eql(diff.hasValue('same1_value'), false)
    assert.eql(same.hasValue('diff2_value'), false)
  },

  'test #clear': function() {
    before()
    map.clear()
    assert.eql(map.length, 0)
  },

  'test #dispose': function() {
    before()
    map.dispose()
    assert.eql(map.length, 0)
  }
}

