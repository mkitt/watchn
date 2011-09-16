
watchn.watch('uglify', [libs], function(options) {
  watchn.execute('make uglify', options, 'uglify', false, true)
})

