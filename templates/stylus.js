
watchn.watch('stylus', [styles], function(options) {
  watchn.execute('make stylus', options, 'stylus', false, true)
})

