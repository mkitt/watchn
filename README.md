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

## todo ##

* Refactor based on the stories
* Add watchn to directories and not just files within a directory (see story)
* Revisit reloading and when and how this happens? [nodules][nodules]?
* Clean and simplify
* Address the todo items within `./lib/watchn.js`
* Refactor the ./examples/example.js to support "rules"
* Bring back shell support
* Refactor dirty glob methods
  * Include options for filtering files or file types within a directory
* Add rules for files in a directory
* Add growl support in examples
* Add examples and default watchn.js
* Add man page
* Update github wiki and gh-pages
* Peer reviews


[nodules]: http://github.com/kriszyp/nodules
