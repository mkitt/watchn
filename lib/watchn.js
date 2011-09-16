
// Intelligently and continuously auto execute targets on file/directory changes.
// (c) 2011 Matthew Kitt

// Module dependencies..
var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec;
var Map = require('./map')
var Reporter = require('./reporters/reporter')

// ## Public API

// Instantiates a watcher
var Watchn = module.exports = function Watchn(silent) {
  this.watched = new Map()
  this.rules = new Map()
  this.reporters = new Map()
  this.silent = silent || false
  this.reporters.add('reporter', new Reporter())
}

Watchn.prototype.execute = function(task, options, reporter_name, growl_pass, growl_fail) {
  if (!task || !options) {
    throw new Error('watchn.execute requires a task and options to be passed in')
  }
  var self = this
  var key = reporter_name || 'reporter'
  var sp = growl_pass || false
  var sf = growl_fail || true
  var reporter = this.getReporter(key)

  if (options.curr > options.prev) {
    exec(task, function(error, stdout, stderr) {
      var report = reporter.report(error, stdout, stderr)
      var show = ((error && sf) || (!error && sp)) ? true : false
      var msg = (report.msg.length > 1) ? report.msg : task
      self.notify(self.getTimestamp() + msg, {name: report.name || task, msg: report.gmsg}, show)
    })
  }
}

Watchn.prototype.notify = function(msg, growl, show) {
  if (!this.silent) {
    console.log(msg)

    if (growl && show) {
      exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"')
    }
  }
}

// TODO: Move to utilities?
Watchn.prototype.getTimestamp = function() {
  var pattern = /(?!\w+)\s/
  var curtime = new Date().toTimeString()
  var space_index = curtime.search(pattern)
  return curtime.substr(0, space_index) + ': '
}

// TODO: Move to utilities?
Watchn.prototype.getReporter = function(key) {
  return (this.reporters.hasKey(key)) ? this.reporters.get(key) : this.createReporter(key);
}

// TODO: Need to test for user defined reporters in the cwd's path
// TODO: Move to utilities?
Watchn.prototype.createReporter = function(key) {
  var reporter
  try {
    reporter = require('./reporters/' + key + '_reporter')
  } catch(e) {
    throw new Error(e)
  }
  var new_reporter = new reporter()
  this.reporters.add(key, new_reporter)

  return new_reporter
}

// noop function to quickly ignore a `watchn.watch` method in a runner without having to comment it out
Watchn.prototype.xwatch = function() {
}

// Core method for watching files based on a set of rules with a callback function
Watchn.prototype.watch = function(rule, locs, fn) {
  if (!rule || !locs || !fn) {
    throw new Error('watchn.watch requires a rule, locs (file/dir), and callback')
  }

  // If a single file comes in, convert it to an array
  var items = (locs instanceof Array) ? locs : [locs]
  var watchables = this.collect(items, [])

  // Add each file to a map of watchables and execute the rule it's associated with
  for (var i = 0, len = watchables.length; i < len; i += 1) {
    var watchable = watchables[i]
    this.addToWatched(watchable)
    this.addToRules(rule, watchable, fn)
    this.notify('watchn: "' + watchable + '" - (' + rule + ')')
  }
}

// Stop watchn stuff associated with either rules or location or both!
Watchn.prototype.unwatch = function(rule, locs) {
  var msg = ''

  // kill everything..
  if (!rule && !locs) {
    this.unwatchAll()
    msg = 'unwatchn: all locations and rules'

  // kill an entire rule..
  } else if (rule && !locs) {
    this.removeRule(rule)
    msg = 'unwatchn: rule - (' + rule + ')'

  // kill all locations regardless of rules..
  } else if (!rule && locs) {
    this.removeAllLocations(locs)
    msg = 'unwatchn: all rules for  "' + locs

  // kill locations associated with a rule..
  } else {
    this.removeLocationsFromRule(rule, locs)
    msg = 'unwatchn: "' + locs + ' for rule " - (' + rule + ')'
  }
  this.notify(msg)
}

// Handle the change event and apply the callback (typically to a `.watchn` file)
Watchn.prototype.changed = function(options) {
  var self = this
  this.rules.each(function(key, value) {
    if (value.watched.hasValue(options.item)) {
      self.modified(options.item, key)
      value.fn(options)
    }
  })
}

// Convenience function to inspect what is being watched and their rules
// TODO: Move to utilities?
Watchn.prototype.inspect = function() {
  var wts = this.watched.toString()
  var rts = this.rules.toString()
  return 'watched:\n' + wts + '\n\nrules:\n' + rts
}

// Total and complete cleanup
Watchn.prototype.dispose = function() {
  this.unwatch()
}

// ## Internal

// Add to the queue of watched files (only add if already not being watched) and listen for changes
Watchn.prototype.addToWatched = function(item) {
  var self = this
  var isWatched = this.watched.hasValue(item)
  if (!isWatched) {
    fs.watchFile(item, {persistent: true, interval: 50}, function (curr, prev) {
      fs.stat(item, function (err, stats) {
        if (err) {
          self.removeLocation(item)
          self.removeFromWatched(item)
          self.notify('unwatchn: all rules for  "' + item)
        } else {
          self.changed({curr: curr.mtime, prev: prev.mtime, item: item, stats: stats})
        }
      })
    })
    this.watched.add(this.uid(item), item)
  }
  return isWatched
}

// Add file(s) to an existing rule
Watchn.prototype.addToRules = function(rule, item, fn) {
  var key = this.uid(item)
  var isNew = true
  try {
    var map = new Map()
    map.add(key, item)
    this.rules.add(rule, {watched: map, fn: fn})
  } catch (err) {
    var watched = this.rules.get(rule).watched
    watched.add(key, item)
    isNew = false
  }
  return isNew
}

// Remove a file from all rules from being watched
Watchn.prototype.removeFromWatched = function(item) {
  var key = this.uid(item)
  var self = this
  var stillWatched = false

  this.rules.each(function (key, value) {
    if (value.watched.hasKey(self.uid(item))) {
      stillWatched = true
      return;
    }
  })

  if (!stillWatched) {
    try {
      fs.unwatchFile(item)
      this.watched.remove(key)
    } catch (err) {}
  }
  return stillWatched
}

// Kill all files from being watched
Watchn.prototype.unwatchAll = function() {
  var self = this
  this.rules.dispose()
  this.watched.each(function(key, value) {
    self.removeFromWatched(value)
  })
  this.watched.dispose()
}

// Remove a rule and files from being watched,
// if files are contained in another rule they will continue to be watched
Watchn.prototype.removeRule = function(rule) {
  var r = this.rules.remove(rule)
  var unwatchables = r.watched.values
  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    this.removeFromWatched(unwatchables[i])
  }
  return unwatchables
}

// Remove a single file from responding to a rule
Watchn.prototype.removeLocationFromRule = function(rule, item) {
  var watched = this.rules.get(rule).watched
  var removed = watched.remove(this.uid(item))
  this.removeFromWatched(item)
  return removed
}

// Remove the locations from the rule
Watchn.prototype.removeLocationsFromRule = function(rule, locs) {
  var items = (locs instanceof Array) ? locs : [locs]
  var unwatchables = this.collect(items, [])
  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    this.removeLocationFromRule(rule, unwatchables[i])
  }
  return unwatchables
}

// Remove the file from all rules
Watchn.prototype.removeLocation = function(item) {
  var self = this
  var count = 0
  this.rules.each(function(key, value) {
    if (value.watched.hasValue(item)) {
      self.removeLocationFromRule(key, item)
      count += 1;
    }
  })
  return count
}

Watchn.prototype.removeAllLocations = function(locs) {
  var items = (locs instanceof Array) ? locs : [locs]
  var unwatchables = this.collect(items, [])

  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    this.removeLocation(unwatchables[i])
  }
  return unwatchables
}

// Check if a directory has been modified
Watchn.prototype.modified = function(dir, rule) {
  if (fs.statSync(dir).isDirectory()) {
    var r = this.rules.get(rule)
    var dirs = this.collectSubDirs(dir, [])
    var mod = this.difference(dirs, r.watched.values)
    if (mod.length > 0) {
      this.watch(rule, mod, r.fn)
    }
  }
}

// TODO: Move to utilities?
Watchn.prototype.difference = function(a1, a2) {
  return a1.filter(function(i) {
    return (a2.indexOf(i) < 0);
  })
}

// Collect files in a directory
// TODO: Move to utilities?
Watchn.prototype.collect = function(items, watchables) {
  var self = this
  for (var i = 0, len = items.length; i < len; i += 1) {
    var item = path.normalize(items[i])
    if (fs.statSync(item).isFile()) {
      watchables.push(item)
    } else {
      var dirs = this.collectSubDirs(item, [])
      watchables = watchables.concat(dirs)
    }
  }
  return watchables
}

// Collect files in sub directories
// TODO: Move to utilities?
Watchn.prototype.collectSubDirs = function(dir, dirs) {
  var self = this
  if (fs.statSync(dir).isDirectory()) {
    dirs.push(dir)
    fs.readdirSync(dir).forEach(function (item) {
      self.collectSubDirs(path.normalize(path.join(dir, item)), dirs)
    })
  }
  return dirs
}

// Give each file a unique identifier
Watchn.prototype.uid = function(str) {
  return str.replace(/[\/\.]/g, '_')
}

// ## Helper Methods
// TODO: Move to utilities or delete?
// For use in a `.watchn` file

// Clean up surrounding white space
Watchn.prototype.trim = function(str) {
  return str.replace(/^\s+|\s+$/g,'')
}

// Clean up any ansi characters
Watchn.prototype.trimANSI = function(str) {
  return str.replace(/\[\d+m/g, '')
}

// Clean up new lines
Watchn.prototype.trimNewlines = function(str) {
  return str.replace(/\n/g, ' ')
}

