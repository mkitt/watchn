
test:
	@expresso -I lib test/*

coverage:
	@expresso -g -I lib --cov test/*
	@rm -rf lib-cov

watchn:
	@bin/watchn .watchn

css:
	@stylus < examples/stylesheets/style.styl > examples/stylesheets/style.css
	@echo examples/stylesheets/style.css built

html:
	@jade < examples/views/index.jade > examples/views/index.html
	@echo examples/views/index.html built

js:
	@cat examples/javascripts/src/file1.js > examples/javascripts/app.js
	@cat examples/javascripts/src/file2.js >> examples/javascripts/app.js
	@uglifyjs -v -o examples/javascripts/app.min.js examples/javascripts/app.js

docs:
	@docco lib/*.js

publish: coverage docs site

noop:


.PHONY: test coverage demo css html docs publish noop

