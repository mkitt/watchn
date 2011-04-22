
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


// This is file 2
(function() {
  var arg = 3;
  function anotherFunction(args) {
    if (args) {
      arg = args;
    }
  }
  anotherFunction(arg++);
  console.log(arg);
}());

