## watchn ##

Work in progress. Still a bunch todo.

To see a basic working example:

* In Terminal: `$ node example.js`
* Modify a line in `./lib/reporter.js`, `./lib/colored.js` or `./test/test.js`
* Modify a line in `./example.js` to force the process to reload
* Save that file and it will auto run `./test/test.js`

For more descriptions, please read the tests in `./test/test.js`

### TODO ###

* Revisit reloading and when and how this happens? nodules?
* What happens when a file has more than 1 action?
* Refactor dirty glob methods => include options for filtering files or file types in a directory
* Add rules for files in a directory
* Add callback to action
* Add fs.stat to the watch callback
* Add definitions around configuration
* Address the todo items within `./lib/watchn.js`
* Bring back shell support?
* Fix the 2 JSLint errors dealing with functions in loop
* Add man page
* Add examples and default watchn.js
* Update github wiki
* Peer review
