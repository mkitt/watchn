require.paths.push('./lib');
var sys = require('sys'),
    style = require('colored'),
    tests,
    tests_len,
    asserts = 0,
    failed = 0,
    started = 0,
    log = [],
    reporter = exports;

reporter.start = function (specs) {
  tests = specs;
  tests_len = tests.length;
  sys.puts('Started');
  started = Number(new Date());
  this.next();
};

reporter.next = function () {
  if (tests.length > 0) {
    tests.shift()();
  } else {
    this.report();
  }
};

reporter.log = function (passed, e) {
  if (passed) {
    asserts += 1;
    sys.print(style.green('.'));
  } else {
    failed += 1;
    sys.print(style.red('F'));
    log.push(e);
  }
};

reporter.report = function () {
  var tests_ran = 0,
      asserts_ran = 0,
      elapsed = 0,
      summary = '',
      message = '';
    
  elapsed = (Number(new Date()) - started) / 1000;
  sys.puts('\n');
  
  for (var i = 0, len = log.length; i < len; i += 1) {
    sys.puts(log[i]);
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
};