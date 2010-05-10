## watchn ##

Work in progress. Still a bunch todo.

To see a basic working example:

* In Terminal: `$ node example.js`
* Modify a line in `./lib/reporter.js`, `./lib/colored.js` or `./test/test.js`
* Modify a line in `./example.js` to force the process to reload
* Save that file and it will auto run `./test/test.js`

For more descriptions, please read the test cases in `./test/test.js`  
  
### TODO ###

* If a file has been deleted, need to remove it from the list
* Refactor naming scheme?
* Kill switch?
* Refactor dirty glob methods => include options for filtering files or file types in a directory
* Add shell support
* Add examples => include usage with growl summary support
* Add man page
* Update github wiki
* Peer review