Notes and stories around the refactor

## Terminology ##

* **Directory Rules**: Action(s) applied to files within a directory or subdirectories
* **Directory Commands**: Directive performed when a directory observes a change
* **File Actions**: Directive performed when a file observes a change


## Flow ##

### Directories ###

* A directory should have a rule(s) associated with types of files within that directory(s)
* A directory should have a command(s) when a change is observed
* A directory can have multiple rules associated with multiple commands
* A subdirectory added to a watched directory should inherit the watched directories rule(s)
* A subdirectory added to a watched directory should inherit the watched directories command(s)
* A subdirectory should be able to ignore the rule(s) of it's parent directory
* A subdirectory should be able to ignore the command(s) of it's parent directory
* A changed directory should pass a `fs.stat` object which should denote if a file or subdirectory was added or deleted
* A deleted directory should not be watched any longer (includes files within the deleted directory)


### Files ###

*Needs to be completed!*

* A file can have an action(s) associated with a directories rule(s) when a change is observed to that file
* A file can have a action(s) not associated with any rule(s) established by a directory


## Notes ##

`fs.watchFile` behavior on directories

* When a file or folder is added to a watched directory it broadcasts a change
* When a file or folder is deleted from a watched directory it broadcasts a change
* Adding files to a non watched sub directory of a watched directory does not broadcast a change
* Changes are detected only in the root level of the watched directory
* Changing files within a watched directory does not report changes



