
test:
	@expresso -I lib test/*

coverage:
	@expresso -g -I lib --cov test/*
	@rm -rf lib-cov

demo:
	@node examples/demo.js

css:
	@stylus < examples/public/stylesheets/style.styl > examples/public/stylesheets/style.css
	@echo examples/public/stylesheets/style.css built

publish: coverage demo


.PHONY: test coverage demo css publish

