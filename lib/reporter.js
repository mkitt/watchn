
(function () {
  var Reporter,
      sys = require('sys'),
      style = require('colored'),
      tests,
      tests_len = 0,
      asserts = 0,
      failed = 0,
      started = 0,
      logs = [];
      
  function report(argument) {
    var tests_ran = 0,
        asserts_ran = 0,
        elapsed = 0,
        summary = '',
        message = '';

    elapsed = (Number(new Date()) - started) / 1000;
    sys.puts('\n');

    for (var i = 0, len = logs.length; i < len; i += 1) {
      sys.puts(logs[i]);
    }

    tests_ran = tests_len;
    asserts_ran = asserts + failed;
    summary += 'Finished in ' + elapsed + ' seconds\n';
    summary += tests_ran + ' test' + ((tests_ran === 1) ? '' : 's') + ', ';
    summary += asserts_ran + ' assertion' + ((asserts_ran === 1) ? '' : 's') + ', ';
    summary += failed + ' failure' + ((failed === 1) ?  '' : 's');

    message = (failed > 0) ? style.red(summary) : style.green(summary);
    sys.puts(message);

    process.exit(failed);
  }
  
  function log(passed, e) {
    if (passed) {
      asserts += 1;
      sys.print(style.green('.'));
    } else {
      failed += 1;
      sys.print(style.red('F'));
      logs.push(e);
    }
  }
  
  function next() {
    if (tests.length > 0) {
      tests.shift()();
    } else {
      report();
    }
  }
  
  function start(specs) {
    tests = specs;
    tests_len = tests.length;
    sys.puts('Started');
    started = Number(new Date());
    next();
  }
  
  Reporter = function Reporter() {
    
  };
  
  Reporter.start = start;
  Reporter.next = next;
  Reporter.log = log;
  Reporter.report = report;
  
  // Hook into Node's module system.
  if (typeof module !== 'undefined') {
    module.exports = Reporter;
  }
  
}());
