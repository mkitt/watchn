
test:
	@expresso -I lib test/* test/reporters/*

coverage:
	@expresso -g -I lib --cov test/* test/reporters/*
	@rm -rf lib-cov

watchn:
	@bin/watchn .watchn

coffee:
	@coffee -o examples/coffeescript/ -c examples/coffeescript/

jasmine:
	@jasmine-node examples/jasmine/test_spec.js

jasmine_dom:
	@jasmine-dom --runner examples/jasmine-dom/index.html --format nice

jshint:
	@jshint examples/javascripts/src/

vows:
	@echo Not yet completed!

scss:
	@sass examples/scss/style.scss > examples/scss/style.css

sass:
	@sass examples/sass/style.sass > examples/sass/style.css

haml:
	@haml -eq examples/haml/index.haml examples/haml/index.html

stylus:
	@stylus < examples/stylus/style.styl > examples/stylus/style.css

jade:
	@jade < examples/jade/index.jade > examples/jade/index.html

markdown:
	@markdown -o examples/markdown/index.html examples/markdown/index.md

uglify:
	@cat examples/javascripts/src/file1.js > examples/javascripts/app.js
	@cat examples/javascripts/src/file2.js >> examples/javascripts/app.js
	@uglifyjs -v -o examples/javascripts/app.min.js examples/javascripts/app.js

docs:
	@docco lib/*.js

publish: coverage docs

noop:


.PHONY: test coverage watchn coffee jasmine jasmine_dom jshint vows scss sass haml stylus jade markdown uglify docs publish noop

