
var difference = exports.difference = function(a1, a2) {
  return a1.filter(function(i) {
    return (a2.indexOf(i) < 0);
  })
}

var uid = exports.uid = function(str) {
  return str.replace(/[\/\.]/g, '_')
}

var timestamp = exports.timestamp = function() {
  var pattern = /(?!\w+)\s/
  var curtime = new Date().toTimeString()
  var space_index = curtime.search(pattern)
  return curtime.substr(0, space_index) + ': '
}

