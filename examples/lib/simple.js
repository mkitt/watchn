
(function () {
  var simple;

  function returnTruthy() {
    return true;
  }
  
  function returnFalsey() {
    return false;
  }
  
  function returnTen() {
    return 10;
  }
  
  function returnMansfield() {
    return 'Mansfield';
  }
  
  function returnIsA() {
    return 'is a';
  }
  
  function returnDog() {
    return 'dog';
  }

// ----------------------------------------------------------------------------
  simple = function simple() {};
  simple.returnTruthy = returnTruthy;
  simple.returnFalsey = returnFalsey;
  simple.returnTen = returnTen;
  simple.returnMansfield = returnMansfield;
  simple.returnIsA = returnIsA;
  simple.returnDog = returnDog;
  
  if (typeof module !== 'undefined') {
    module.exports = simple;
  }
    
}());
