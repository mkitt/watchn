
test:
	@expresso -I lib test/*

coverage:
	@expresso -g -I lib --cov test/*
	@rm -rf lib-cov

demo:
	@bin/watchn examples/demo.js

log:
	@bin/watchn examples/log.js

css:
	@stylus < examples/public/stylesheets/style.styl > examples/public/stylesheets/style.css
	@echo examples/public/stylesheets/style.css built

html:
	@jade < examples/public/views/index.jade > examples/public/views/index.html
	@echo examples/public/views/index.html built

js:
	@cat examples/public/javascripts/src/file1.js > examples/public/javascripts/app.js
	@cat examples/public/javascripts/src/file2.js >> examples/public/javascripts/app.js
	@uglifyjs -v -o examples/public/javascripts/app.min.js examples/public/javascripts/app.js


publish: coverage demo


.PHONY: test coverage demo css html publish

