
// Intelligently and continuously auto execute targets on file/directory changes.
// (c) 2011 Matthew Kitt

// Module dependencies..
var fs = require('fs')
var path = require('path')
var exec = require('child_process').exec;
var Map = require('./map')
var utils = require('./utils')
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

// noop function to quickly ignore a `watchn.watch` method in a runner without having to comment it out
Watchn.prototype.xwatch = function() {
  return this
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
  return this
}

// Call a task after a file has been changed using either a built-in or custom reporter
Watchn.prototype.execute = function(task, options, reporter_name, growl_pass, growl_fail) {
  if (!task || !options) {
    throw new Error('watchn.execute requires a task and options to be passed in')
  }
  var self = this
  var key = reporter_name || 'reporter'
  var sp = growl_pass || false
  var sf = growl_fail || true
  var reporter = this.getReporter(key)

  // Only report something if the file has changed
  if (options.curr > options.prev) {
    // shell out to the task and wait for a return
    exec(task, function(error, stdout, stderr) {
      // send to the reporter for processing the output
      var report = reporter.report(error, stdout, stderr)
      var show = ((error && sf) || (!error && sp)) ? true : false
      var msg = (report.msg.length > 1) ? report.msg : task
      // time stamp the message and send along the stdout and optional growl notifications
      self.notify(utils.timestamp() + msg, {name: report.name || task, msg: report.gmsg}, show)
    })
  }
  return this
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
  return this
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

// Report to the user some sort of message.
Watchn.prototype.notify = function(msg, growl, show) {
  if (!this.silent) {
    console.log(msg)
    // If growl is installed and the user opts in growl the message as well.
    if (growl && show) {
      exec('growlnotify -name '+  growl.name + ' -m "' + growl.msg + '"')
    }
  }
}

// Convenience function to inspect what is being watched and their rules
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
    this.watched.add(utils.uid(item), item)
  }
  return isWatched
}

// Add file(s) to an existing rule
Watchn.prototype.addToRules = function(rule, item, fn) {
  var key = utils.uid(item)
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
  var key = utils.uid(item)
  var self = this
  var stillWatched = false

  this.rules.each(function (key, value) {
    if (value.watched.hasKey(utils.uid(item))) {
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
  var removed = watched.remove(utils.uid(item))
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

// Kill all locations within all keys
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
    var mod = utils.difference(dirs, r.watched.values)
    if (mod.length > 0) {
      this.watch(rule, mod, r.fn)
    }
  }
}

// See if a reporter type has been instantiated, if so return it, otherwise `createReporter`
Watchn.prototype.getReporter = function(key) {
  return (this.reporters.hasKey(key)) ? this.reporters.get(key) : this.createReporter(key);
}

// Instantiate a reporter by name for use in running a task
Watchn.prototype.createReporter = function(key) {
  var reporter
  try {
    // Look for the built-in reporters first
    reporter = require('./reporters/' + key + '_reporter')
  } catch(e) {
    // didn't find a built in one, so check if the user has one...
    var filename = key + '_reporter'
    var found = this.findReporterFile(process.cwd(), filename)
    if (!found) {
      // Not found, tell 'em about it
      var msg = 'File ' + filename + '.js not found'
      this.notify(msg, {name: 'Error!!', msg: msg}, true)
      throw new Error(msg)
    }
    // instantiate the custom reporter
    reporter = require(found)
  }
  // create the new reporter and store it so we don't have to look it up again
  var new_reporter = new reporter()
  this.reporters.add(key, new_reporter)

  return new_reporter
}

// Look for the reporter file starting in the `cwd` and pass back it's reference.
Watchn.prototype.findReporterFile = function(dir, file) {
  var self = this
  var buffer
  var tmp

  fs.readdirSync(dir).forEach(function (item) {
    var absolute = path.normalize(dir + '/' + item)

    if (fs.statSync(absolute).isFile() && path.basename(item, '.js') === file) {
      buffer = absolute
      return;
    } else if (fs.statSync(absolute).isDirectory()) {
      tmp = self.findReporterFile(absolute, file)
      if (tmp) {
        buffer = tmp
        return;
      }
    }
  })
  return buffer
}

// Collect files in a directory
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

