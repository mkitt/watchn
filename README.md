## watchn ##

Work in progress. Still a bunch todo.

To see a basic working example:

* In Terminal: `$ node examples/example.js`
* Modify a line in `./examples/test/test-simple1.js` or `./examples/test/test-simple2.js`
* Modify a line in `./examples/example.js` to force the process to reload
* Save the file you modified and it will auto run the test for that file, if it passes it will invoke `./examples/test/runner.js` to run the full suite

To run the test case on `watchn.js`:
* In Terminal: `$ node test/test.js`

This test will take awhile as it's writing files and watching files within `./test/helpers/`

For more descriptions, please read the tests in `./test/test.js`

### TODO ###

* Add definitions around configuration
* Add callback to action or an options args?
* Add options args to watch?
* Add the ability to abort a callback's callback on a failed exit
* There's probably a more efficient way to chain callbacks
* Write and watch a log file for size changes
* Revisit reloading and when and how this happens? [nodules](http://github.com/kriszyp/nodules)?
* What happens when a file has more than 1 action? Does it need priority?
* Refactor dirty glob methods => include options for filtering files or file types in a directory
* Add rules for files in a directory
* Bring back shell support
* Address the todo items within `./lib/watchn.js`
* Add man page
* Add examples and default watchn.js
* Update github wiki
* Peer review
