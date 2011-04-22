
// This is file 1
(function() {
  var arg = 1;
  function myFunction(args) {
    if (args) {
      arg = args;
    }
  }
  myFunction(arg++);
  console.log(arg);
}());

