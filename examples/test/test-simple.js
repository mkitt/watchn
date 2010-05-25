
(function () {
  require.paths.push('./lib');
  require.paths.push('./examples/lib');
  
  var assert = require('assertn'),
      simple = require('simple'),
      test = {};
      
// ----------------------------------------------------------------------------  
  
  test.should_return_true = function () {
    assert.ok(simple.returnTruthy(), 'should_return_true');
  };
  
  test.should_return_false = function () {
    assert.equal(simple.returnFalsey(), false, 'should_return_false');
  };
  
  test.should_return_ten = function () {
    assert.equal(simple.returnTen(), 10, 'should_return_ten');
  };
  
  test.should_return_mansfield = function () {
    assert.equal(simple.returnMansfield(), 'Mansfield', 'should_return_mansfield');
  };
  
  test.should_fail = function () {
    assert.equal(true, false, 'Expected to fail!');
  };
  
  test.should_return_is_a = function () {
    assert.equal(simple.returnIsA(), 'is a', 'should_return_is_a');
  };
  
  test.should_return_dog = function () {
    assert.equal(simple.returnDog(), 'dog', 'should_return_dog');
  };

// ----------------------------------------------------------------------------

  assert.start(test, 'test-simple.js');
    
}());
