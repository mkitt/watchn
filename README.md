## watchn ##

Work in progress. Still a bunch todo.

To see a basic working example:

* In Terminal: `$ node example.js`
* Modify a line in `./lib/reporter.js`, `./lib/colored.js` or `./test/test.js`
* Modify a line in `./example.js` to force the process to reload
* Save that file and it will auto run `./test/test.js`

For more descriptions, please read the tests in `./test/test.js`

### TODO ###

* Figure out why `file` is not resolving correctly (it's within `watchn.watch()`)
* Add definitions around configuration
* Add callback to action or an options args?
* Add options args to watch?
* Add the ability to abort a callback's callback on a failed exit
* There's probably a more efficient way to chain callbacks
* Revisit reloading and when and how this happens? [nodules](http://github.com/kriszyp/nodules)?
* What happens when a file has more than 1 action? Does it need priority?
* Refactor dirty glob methods => include options for filtering files or file types in a directory
* Add rules for files in a directory
* Bring back shell support
* Fix the 2 JSLint errors dealing with functions in loop
* Address the todo items within `./lib/watchn.js`
* Add man page
* Add examples and default watchn.js
* Update github wiki
* Peer review
