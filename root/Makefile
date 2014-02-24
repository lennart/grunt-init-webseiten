bundle: build
	grunt bundle

build: scaffold
	grunt

dist: all
	grunt dist

scaffold: npm
	grunt scaffold

serve: all
	$(grunt serve) &\
	$(grunt listen) &\

npm:
	npm install

