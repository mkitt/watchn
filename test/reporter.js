var sys = require('sys'),
    tests,
    tests_len,
    asserts = 0,
    failed = 0,
    started = 0,
    log = [],
    ansi = { green: '\033[32m', red: '\033[31m', none: '\033[0m' },
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
    sys.print(ansi.green + '.' + ansi.none);
  } else {
    failed += 1;
    sys.print(ansi.red + 'F' + ansi.none);
    log.push(e);
  }
};

reporter.report = function () {
  var tests_ran,
      asserts_ran,
      elapsed,
      msg;
    
  elapsed = (Number(new Date()) - started) / 1000;
  sys.puts('\n');
  
  for (var i = 0, len = log.length; i < len; i += 1) {
    sys.puts(log[i]);
  }
  
  tests_ran = tests_len;
  asserts_ran = asserts + failed;
  msg = (failed > 0) ? ansi.red : ansi.green;
  msg += tests_ran + ' test' + ((tests_ran === 1) ? '' : 's') + ', ';
  msg += asserts_ran + ' assertion' + ((asserts_ran === 1) ? '' : 's') + ', ';
  msg += failed + ' failure' + ((failed === 1) ?  '' : 's');
  msg += ansi.none;
  sys.puts('Finished in ' + elapsed + ' seconds');
  sys.puts(msg);
  process.exit(failed);
};