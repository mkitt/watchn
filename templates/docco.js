
watchn.watch('docs', [libs], function(options) {
  watchn.execute('make docs', options, 'docco', false, true)
})

