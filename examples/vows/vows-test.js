
var vows = require('vows')
var assert = require('assert')

vows.describe('Division by Zero').addBatch({
  'when dividing a number by zero': {
    topic: function () { return 42 / 0 },

    'we get Infinity': function (topic) {
      assert.equal (topic, Infinity);
    },

    'we get false': function (topic) {
      assert.equal (true, true);
    }
  },

  'but when dividing zero by zero': {
    topic: function () { return 0 / 0 },

    'we get a value which': {
      'is not a number': function (topic) {
        assert.isNaN (topic);
      },
      'is not equal to itself': function (topic) {
        assert.notEqual (topic, topic);
      }
    }
  }
}).export(module);

