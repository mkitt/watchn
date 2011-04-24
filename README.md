
# watchn

Intelligently and continuously auto execute targets on file/directory changes. File watching on steroids.

Currently in active development and testing. Full documentation and use case studies coming soon. For the time being see `examples/demo.js` for implementing a watchn runner. There is also quite a bit of information listed in `test/watchn.test.js`


## Installation

    npm install watchn


## Usage and Options

    Usage:
      watchn [options] <program>

    Program <required>:
      <program>                   The runner program to respond to watched items

    Options [optional]:
      -h, --help                  Output help information
      -v, --version               Output the current version
      -s, --silent                Quiet watchn except for errors
      -r, --runner <name>         Basic stub for a new runner file
      -t, --template <name>       Generate a watchn.watch method for a program type
      -l, --list-templates        List available template arguments for generation

    Examples:
      watchn watchnrunner.js      Starts watchn with a runner file
      watchn -s watchnrunner.js   Starts watchn in quiet mode with a runner file
      watchn -r watchnrunner.js   Generates a default runner file
      watchn -t stylus            Generates a watch method for the stylus library
      watchn -l                   Lists available templates for various libraries


## Todo

- Documentation
- Add a documentation example to the demo and generators
- Fix reloading (needs to run in child process)
- Utility method for finding files based on filetype
- Add generators for ruby and a few other languages
- Peer review


## Inspiration

Loosely based on [mynyml's fabulous watchr for ruby](http://mynyml.com/ruby/flexible-continuous-testing)


## License

(The MIT License)

Copyright (c) 2011 Matthew Kitt

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

