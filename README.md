## watchn ##

Work in progress. Still a bunch todo.

To see a basic working example:

* In Terminal: `$ node example.js`
* Modify a line in `./lib/reporter.js`, `./lib/colored.js` or `./test/test.js`
* Modify a line in `./example.js` to force the process to reload
* Save that file and it will auto run `./test/test.js`

For more descriptions, please read the test cases in `./test/test.js`  
  
### TODO ###

* Capture terminal key to refresh
* Rewrite the tests to be a little more modular
* Think of setup and teardown methods as well for general use cases
* Refactor naming
* Kill switch
* Address the todo items
* Add shell support
* What happens when a file has more than 1 action?
* Add man page
* Add examples => include usage with growl summary support
* Update github wiki
* Refactor dirty glob methods => include options for filtering files or file types in a directory
* Peer review