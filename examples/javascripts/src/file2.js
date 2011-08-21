
// This is file 2
(function() {
  var arg = 3
  function anotherFunction(args) {
    if (args) {
      arg = args
    }
  }
  anotherFunction(arg++)
  console.log(arg)
}())

