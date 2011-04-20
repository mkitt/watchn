
var fs = require('fs');
var path = require('path');


var Watchn = module.exports = function Watchn(silent) {
  this.version = '0.0.5';
  this.watched = [];
  this.rules = [];
  this.queue = [];
  this.silent = silent || false;
  this.started = false;
  this.testenv = false;
};

Watchn.prototype.watch = function(rule, locs, fn) {
  if (!rule || !locs || !fn)
    throw new Error('watchn.watch requires a rule, locs (file/dir), and callback');

  if (!this.started)
    this.report('watchn has started..');
  this.started = true;

  var items = (locs instanceof Array) ? locs : [locs];
  var watchables = this.collect(items, []);

  for (var i = 0, len = watchables.length; i < len; i += 1) {
    var watchable = watchables[i];
    this.addToWatched(watchable);
    this.addToRules(rule, watchable, fn);
    this.report('watchn: "' + watchable + '" - (' + rule + ')');
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
    msg = 'unwatchn: all locations - (' + rule + ')';

  // kill all locations regardless of rules..
  } else if (!rule && locs) {
    this.removeLocations(locs);
    msg = 'unwatchn: all rules for  "' + locs;

  // kill locations associated with a rule..
  } else {
    this.removeLocationsFromRule(rule, locs);
    msg = 'unwatchn: "' + locs + '" - (' + rule + ')';
  }
  this.report(msg);

  if (this.watched.length === 0 && !this.testenv) {
    this.exit();
  }
};

Watchn.prototype.report = function(msg) {
  if(!this.silent)
    console.log(msg);
};

Watchn.prototype.changed = function(options) {
  for (var i = 0, len = this.rules.length; i < len; i += 1) {
    var rule = this.rules[i];
    var watched = rule.watched;
    for (var k = 0, leng = watched.length; k < leng; k += 1) {
      if (watched[k] === options.item) {
        rule.fn(options);
      }
    }
  }
};

Watchn.prototype.dispose = function() {
  this.unwatch();
};

Watchn.prototype.exit = function() {
  this.rules.length = 0;
  this.queue.length = 0;
  this.report('..thanks for watchn');
  process.exit(0);
};

/* Internal :: So many loops, begging for some optimization */

Watchn.prototype.addToWatched = function(item) {
  var self = this;
  var isWatched = false;
  for (var i = 0, len = this.watched.length; i < len; i += 1) {
    if (this.watched[i] === item) {
      isWatched = true;
    }
  }
  if (!isWatched) {
    fs.watchFile(item, {persistent: true, interval: 50}, function (curr, prev) {
      fs.stat(item, function (err, stats) {
        if (err)
          throw new Error(err);
        self.changed({curr: curr.mtime, prev: prev.mtime, item: item, stats: stats});
      });
    });
    this.watched.push(item);
  }
  return isWatched;
};

Watchn.prototype.removeFromWatched = function(item) {
  for (var i = 0, len = this.watched.length; i < len; i += 1) {
    if (this.watched[i] === item)
      if (this.numberOfListeners(item) <= 1) {
        fs.unwatchFile(item);
      }
      return this.watched.splice(i, 1);
  }
  return null;
};

Watchn.prototype.unwatchAll = function() {
  this.rules.length = 0;
  for (var i = 0, len = this.watched.length; i < len; i += 1) {
    this.removeFromWatched(this.watched[i]);
  }
  this.watched.length = 0;
};

Watchn.prototype.addToRules = function(rule, item, fn) {
  var existing = this.getRuleDefinition(rule);
  if (existing) {
    return existing.watched.push(item);
  }
  return this.rules.push({rule: rule, watched: [item], fn: fn});
};

Watchn.prototype.removeRule = function(rule) {
  var r = this.getRuleDefinition(rule);
  var unwatchables = r.watched.slice(0);
  this.rules.splice(r.index, 1);
  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    this.removeFromWatched(unwatchables[i]);
  }
};

Watchn.prototype.removeLocations = function(locs) {
  var items = (locs instanceof Array) ? locs : [locs];
  var unwatchables = this.collect(items, []);

  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    var unwatchable = unwatchables[i];

    for (var k = 0, leng = this.rules.length; k < leng; k += 1) {
      this.removeLocationFromRule(this.rules[k].rule, unwatchable);
    }
    this.removeFromWatched(unwatchable);
  }
};

Watchn.prototype.removeLocationFromRule = function(rule, item) {
  var items = this.getRuleDefinition(rule).watched;
  for (var i = 0, len = items.length; i < len; i += 1) {
    if (items[i] === item) {
      items.splice(i, 1);
    }
  }
  return items.length;
};

Watchn.prototype.removeLocationsFromRule = function(rule, locs) {
  var items = (locs instanceof Array) ? locs : [locs];
  var unwatchables = this.collect(items, []);
  for (var i = 0, len = unwatchables.length; i < len; i += 1) {
    this.removeLocationFromRule(rule, unwatchables[i]);
  }
};

/* Utility Methods */

Watchn.prototype.getRuleDefinition = function(rule) {
  for (var i = 0, len = this.rules.length; i < len; i += 1) {
    var r = this.rules[i];
    if (r.rule === rule) {
      r.index = i;
      return r;
    }
  }
  return null;
};

Watchn.prototype.numberOfListeners = function(item) {
  var numListeners = 0;
  for (var i = 0, len = this.rules.length; i < len; i += 1) {
    var items = this.rules[i].watched;
    for (var k = 0, leng = items.length; k < leng; k += 1) {
      if (items[k] === item) {
        numListeners += 1;
      }
    }
  }
  return numListeners;
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

