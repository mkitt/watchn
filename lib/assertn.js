/**
 * Copyright (c) 2010 Matthew Kitt
 * 
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without 
 * restriction, including without limitation the rights to use, 
 * copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following 
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * http://github.com/mkitt/assertn/
 *
 * TODO: The timeout on process.exit is sort of kludge, see:
 * http://groups.google.com/group/nodejs/browse_thread/thread/3fbe1613f2f6f97e
 */
(function () {
  var sys = require('sys'),
      assert = require('assert'),
      style = {},
      assertn,
      logs = [],
      cases = [],
      tests = [],
      tests_len = 0,
      asserts = 0,
      failed = 0,
      started = 0,
      total_time = 0,
      total_tests = 0,
      total_asserts = 0,
      total_failed = 0,
      noop = function () {},
      beforeTestCase = noop,
      beforeTest = noop,
      afterTest = noop,
      afterTestCase = noop;
  
  (function () {
    /**
     * Copyright (c) 2009 Chris Lloyd.
     * Modified from: http://github.com/chrislloyd/colored.js
     */
    var colors = {
        black: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        magenta: 35,
        cyan: 36,
        white: 37,
        reset: 0
      };
      
    function esc(str) {
      return "\x1B[" + str + 'm';
    }
    
    function defineColoredFn(name, code) {
      style[name] = function (str) {
        return esc(code) + (str || this) + esc(colors.reset);
      };
    }
    
    for (var name in colors) {
      if (colors.hasOwnProperty(name)) {
        defineColoredFn(name, colors[name]);
      }
    }
  }());
  
  function summarize(elapsed, tests_ran, asserts_ran, failures) {
    var summary = '',
        message = '';
    summary += 'Finished in ' + elapsed + ' seconds\n';
    summary += tests_ran + ' test' + ((tests_ran === 1) ? '' : 's') + ', ';
    summary += asserts_ran + ' assertion' + ((asserts_ran === 1) ? '' : 's') + ', ';
    summary += failures + ' failure' + ((failures === 1) ?  '' : 's');
    message = (failures > 0) ? style.red(summary) : style.green(summary);
    return message;
  }
  
  function report() {
    var code = (total_failed !== 0) ? 1 : 0;
    sys.puts(summarize(total_time, total_tests, total_asserts + total_failed, total_failed));
    
    setTimeout(function () {
      process.exit(code);
    }, 100);
  }
  
  function getError(e) {
    var msg = (e.message) ? e.message + ': ' : '';
    msg += e.actual + ' ' + e.operator + ' ' + e.expected;
    return msg;
  }
  
  function log(passed, e) {
    if (passed) {
      asserts += 1;
      sys.print(style.green('.'));
    } else {
      failed += 1;
      sys.print(style.red('F'));
      logs.push(getError(e));
    }
  }
    
  function resetTestCaseProps() {    
    tests.length = 0;
    logs.length = 0;
    tests_len = 0;
    asserts = 0;
    failed = 0;
    started = 0;
  }
  
  function logTestCaseResults(duration) {
    total_time += duration;
    total_tests += tests_len;
    total_asserts += asserts;
    total_failed += failed;
  }
  
  function logTestResults() {
    var elapsed = (Number(new Date()) - started) / 1000;
    sys.puts('\n');
    
    for (var i = 0, len = logs.length; i < len; i += 1) {
      sys.puts(logs[i]);
    }
    afterTestCase();
    logTestCaseResults(elapsed);
    resetTestCaseProps();
  }

  function nextTestCase() {
    if (cases.length > 0) {
      require(cases.shift());
    } else {
      report();
    }
  }
  
  function runTest() {
    beforeTest();
    tests.shift()();
    afterTest();
  }

  function nextTest() {
    if (tests.length > 0) {
      runTest();
    } else {
      logTestResults();
      nextTestCase();
    }
  }
  
  function addTestCase(testcase) {
    cases.push(testcase);
  }
  
  function addTestCases(testcases) {
    for (var i = 0, len = testcases.length; i < len; i += 1) {
      addTestCase(testcases[i]);
    }
  }
  
  function startSuite(name, suitez) {
    name = name || '';
    sys.puts('Started Suite ' + name);
    if (suitez) {
      addTestCases(suitez);
    }
    nextTestCase();
  }
  
  function start(suite, name) {
    name = name || '';
    sys.puts('Started ' + name);
    
    for (var func in suite) {
      if (suite.hasOwnProperty(func) && typeof suite[func] === 'function') {
        tests.push(suite[func]);
      }
    }
    tests_len = tests.length;
    started = Number(new Date());
    beforeTestCase();
    nextTest();
  }
  
  function assertion(block, pause) {
    try {
      block();
      log(true);
    } catch (e) {
      log(false, e);
    }
    if (!pause) {
      nextTest();
    }
  }
  
  function before(block) {
    beforeTestCase = block;
  }
  
  function beforeEach(block) {
    beforeTest = block;
  }
  
  function afterEach(block) {
    afterTest = block;
  }
  
  function after(block) {
    afterTestCase = block;
  }

// ----------------------------------------------------------------------------  
  
  function fail(actual, expected, message, operator, pause) {
    assertion(function () {
      assert.fail(actual, expected, message, operator);
    }, pause);
  }
  
  function ok(value, message, pause) {
    assertion(function () {
      assert.ok(value, message);
    }, pause);
  }
  
  function equal(actual, expected, message, pause) {
    assertion(function () {
      assert.equal(actual, expected, message);
    }, pause);
  }
  
  function notEqual(actual, expected, message, pause) {
    assertion(function () {
      assert.notEqual(actual, expected, message);
    }, pause);
  }
  
  function deepEqual(actual, expected, message, pause) {
    assertion(function () {
      assert.deepEqual(actual, expected, message);
    }, pause);
  }
  
  function notDeepEqual(actual, expected, message, pause) {
    assertion(function () {
      assert.notDeepEqual(actual, expected, message);
    }, pause);
  }
  
  function strictEqual(actual, expected, message, pause) {
    assertion(function () {
      assert.strictEqual(actual, expected, message);
    }, pause);
  }
  
  function notStrictEqual(actual, expected, message, pause) {
    assertion(function () {
      assert.notStrictEqual(actual, expected, message);
    }, pause);
  }
  
  function throws(block, error, message, pause) {
    error = error || Error;
    assertion(function () {
      assert.throws(block, error, message);
    }, pause);
  }
  
  function doesNotThrow(block, error, message, pause) {
    error = error || Error;
    assertion(function () {
      assert.doesNotThrow(block, error, message);
    }, pause);
  }
  
// ----------------------------------------------------------------------------
  
  assertn = function assertn() {};
  assertn.startSuite = startSuite;
  assertn.addTestCase = addTestCase;
  assertn.addTestCases = addTestCases;
  assertn.start = start;
  assertn.before = before;
  assertn.beforeEach = beforeEach;
  assertn.afterEach = afterEach;
  assertn.after = after;
  assertn.nextTest = nextTest;
  assertn.fail = fail;
  assertn.ok = ok;
  assertn.equal = equal;
  assertn.notEqual = notEqual;
  assertn.deepEqual = deepEqual;
  assertn.notDeepEqual = notDeepEqual;
  assertn.strictEqual = strictEqual;
  assertn.notStrictEqual = notStrictEqual;
  assertn.throws = throws;
  assertn.doesNotThrow = doesNotThrow;
  
  if (typeof module !== 'undefined') {
    module.exports = assertn;
  }
    
}());
