
var fs = require('fs');
var path = require('path');
var Map = require('./map');


var Watchn = module.exports = function Watchn(silent) {
  this.watched = new Map();
  this.rules = new Map();
  this.silent = silent || false;
};

Watchn.prototype.xwatch = function() {
};

Watchn.prototype.watch = function(rule, locs, fn) {
  if (!rule || !locs || !fn)
    throw new Error('watchn.watch requires a rule, locs (file/dir), and callback');

  var items = (locs instanceof Array) ? locs : [locs];
  var watchables = this.collect(items, []);

  for (var i = 0, len = watchables.length; i < len; i += 1) {
    var watchable = watchables[i];
    this.addToWatched(watchable);
    this.addToRules(rule, watchable, fn);
    this.notify('watchn: "' + watchable + '" - (' + rule + ')');
  }
};

Watchn.prototype.unwatch = function(rule, locs) {
  var msg = '';

  // kill everything..
  if (!rule && !locs) {
    this.unwatchAll();
    msg = 'unwatchn: all locations and rules';

  // kill an entire rule..
  } else if (rule && !locs) {
    this.removeRule(rule);
    msg = 'unwatchn: rule - (' + rule + ')';

  // kill all locations regardless of rules..
  } else if (!rule && locs) {
    this.removeAllLocations(locs);
    msg = 'unwatchn: all rules for  "' + locs;

  // kill locations associated with a rule..
  } else {
    this.removeLocationsFromRule(rule, locs);
    msg = 'unwatchn: "' + locs + ' for rule " - (' + rule + ')';
  }
  this.notify(msg);
};

Watchn.prototype.changed = function(options) {
  var self = this;
  this.rules.each(function(key, value) {
    if (value.watched.hasValue(options.item)) {
      self.modified(options.item, key);
      value.fn(options);
    }
  });
};

Watchn.prototype.notify = function(msg) {
  if (!this.silent)
    console.log(msg);
};

Watchn.prototype.inspect = function() {
  var wts = this.watched.toString();
  var rts = this.rules.toString();
  return 'watched:\n' + wts + '\n\nrules:\n' + rts;
};

Watchn.prototype.dispose = function() {
  this.unwatch();
};

/* Internal */

Watchn.prototype.addToWatched = function(item) {
  var self = this;
  var isWatched = this.watched.hasValue(item);
  if (!isWatched) {
    fs.watchFile(item, {persistent: true, interval: 50}, function (curr, prev) {
      fs.stat(item, function (err, stats) {
        if (err) {
          self.removeLocation(item);
          self.removeFromWatched(item);
          self.notify('unwatchn: all rules for  "' + item);
        } else {
          self.changed({curr: curr.mtime, prev: prev.mtime, item: item, stats: stats});
        }
      });
    });
    this.watched.add(this.uid(item), item);
  }
  return isWatched;
};

Watchn.prototype.addToRules = function(rule, item, fn) {
  var key = this.uid(item);
  var isNew = true;
  try {
    var map = new Map();
    map.add(key, item);
    this.rules.add(rule, {watched: map, fn: fn});
  } catch (err) {
    var watched = this.rules.get(rule).watched;
    watched.add(key, item);
    isNew = false;
  }
  return isNew;
};

Watchn.prototype.removeFromWatched = function(item) {
  var key = this.uid(item);
  var self = this;
  var stillWatched = false;

  this.rules.each(function (key, value) {
    if (value.watched.hasKey(self.uid(item))) {
      stillWatched = true;
      return;
    }
  });

  if (!stillWatched) {
    try {
      fs.unwatchFile(item);
      this.watched.remove(key);
    } catch (err) {}
  }
  return stillWatched;
};

Watchn.prototype.unwatchAll = function() {
  var self = this;
  this.rules.dispose();
  this.watched.each(function(key, value) {
    self.removeFromWatched(value);
  });
  this.watched.dispose();
};

Watchn.prototype.removeRule = function(rule) {
  var r = this.rules.remove(rule);
  var unwatchables = r.watched.values;
  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    this.removeFromWatched(unwatchables[i]);
  }
  return unwatchables;
};

Watchn.prototype.removeLocationFromRule = function(rule, item) {
  var watched = this.rules.get(rule).watched;
  var removed = watched.remove(this.uid(item));
  this.removeFromWatched(item);
  return removed;
};

Watchn.prototype.removeLocationsFromRule = function(rule, locs) {
  var items = (locs instanceof Array) ? locs : [locs];
  var unwatchables = this.collect(items, []);
  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    this.removeLocationFromRule(rule, unwatchables[i]);
  }
  return unwatchables;
};

Watchn.prototype.removeLocation = function(item) {
  var self = this;
  var count = 0;
  this.rules.each(function(key, value) {
    if (value.watched.hasValue(item)) {
      self.removeLocationFromRule(key, item);
      count += 1;
    }
  });
  return count;
};

Watchn.prototype.removeAllLocations = function(locs) {
  var items = (locs instanceof Array) ? locs : [locs];
  var unwatchables = this.collect(items, []);

  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    this.removeLocation(unwatchables[i]);
  }
  return unwatchables;
};

Watchn.prototype.modified = function(dir, rule) {
  if (fs.statSync(dir).isDirectory()) {
    var r = this.rules.get(rule);
    var dirs = this.collectSubDirs(dir, []);
    var mod = this.difference(dirs, r.watched.values);
    if (mod.length > 0) {
      this.watch(rule, mod, r.fn);
    }
  }
};

Watchn.prototype.difference = function(a1, a2) {
  return a1.filter(function(i) {
    return (a2.indexOf(i) < 0);
  });
};

Watchn.prototype.collect = function(items, watchables) {
  var self = this;
  for (var i = 0, len = items.length; i < len; i += 1) {
    var item = path.normalize(items[i]);
    if (fs.statSync(item).isFile()) {
      watchables.push(item);
    } else {
      var dirs = this.collectSubDirs(item, []);
      watchables = watchables.concat(dirs);
    }
  }
  return watchables;
};

Watchn.prototype.collectSubDirs = function(dir, dirs) {
  var self = this;
  if (fs.statSync(dir).isDirectory()) {
    dirs.push(dir);
    fs.readdirSync(dir).forEach(function (item) {
      self.collectSubDirs(path.normalize(path.join(dir, item)), dirs);
    });
  }
  return dirs;
};

Watchn.prototype.uid = function(str) {
  return str.replace(/[\/\.]/g, '_');
};

/* Helper Methods */

Watchn.prototype.trim = function(str) {
  return str.replace(/^\s+|\s+$/g,'');
};

Watchn.prototype.trimANSI = function(str) {
  return str.replace(/\[\d+m/g, '');
};

Watchn.prototype.trimNewlines = function(str) {
  return str.replace(/\n/g, ' ');
};

