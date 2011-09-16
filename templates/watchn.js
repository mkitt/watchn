
var tests = './test/'
var libs = './lib/'


module.exports.init = function(watchn) {

  watchn.watch('test', [tests, libs], function(options) {
    watchn.execute('make test', options, 'jasmine', false, true)
  })

}

/*
// Anatomy of a watchn.watch method..
watchn.watch('id', [array of directories], fn callback {
  watchn.execute('task', options, 'reporter type', growl on pass, growl on fail)
})
*/

