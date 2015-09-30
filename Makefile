sequoia_packages = $(shell jq -r '.dependencies + .devDependencies | keys | map(select(startswith("sequoia"))) | .[]' package.json)

os_adjust = $(if $(filter $(OS),Windows_NT),$(subst /,\\\\,$1),$1)

db_name := $(shell uuidgen)

#set environment variables
export SEQ_TEST_MONGODB_URI=mongodb://localhost/$(db_name)

default: cov lint complexity

clean:
	rm -f coverage.html results.xml
	rm -rf node_modules logs pkg

prepare: clean
	mkdir -p logs
	npm install

link:
	npm link
	npm link $(sequoia_packages)

test:
	make -k wrapped-test
wrapped-test: real-test clean-db
real-test:
	.$(call os_adjust,/node_modules/.bin/lab) -a code

test-watch:
	SEQ_TEST_MONGODB_URI="" nodemon --watch lib --watch test  -- ./node_modules/.bin/lab -a code

spec:
	make -k wrapped-spec
wrapped-spec: real-spec clean-db
real-spec:
	.$(call os_adjust,/node_modules/.bin/lab) -v -a code

spec-watch:
	SEQ_TEST_MONGODB_URI="" nodemon --watch lib --watch test  -- ./node_modules/.bin/lab -v -a code

cov:
	make -k wrapped-cov
wrapped-cov: real-cov-threshold clean-db
real-cov-threshold:
	.$(call os_adjust,/node_modules/.bin/lab) -t 100 -a code

cov-watch:
	SEQ_TEST_MONGODB_URI="" nodemon --watch lib --watch test -- ./node_modules/.bin/lab -t 100 -a code

report: real-cov-report clean-db
real-cov-report:
	rm -fv coverage.html
	.$(call os_adjust,/node_modules/.bin/lab) -r html -t 100 -o coverage.html -a code

spec-cov:
	make -k wrapped-spec-cov
wrapped-spec-cov: real-spec-cov clean-db
real-spec-cov:
	.$(call os_adjust,/node_modules/.bin/lab) -v -t 100 -a code
spec-cov-watch:
	SEQ_TEST_MONGODB_URI="" nodemon --watch lib --watch test  -- ./node_modules/.bin/lab -v -t 100 -a code

lint:
	.$(call os_adjust,/node_modules/.bin/jshint) --reporter node_modules/jshint-stylish lib test
	.$(call os_adjust,/node_modules/.bin/jscs) --config=./.jscsrc lib
	.$(call os_adjust,/node_modules/.bin/jscs) --config=./test/.jscsrc test

complexity:
	.$(call os_adjust,/node_modules/.bin/cr) --minmi 20 --maxcyc 10 --maxhd 20 -n --silent ./lib || true

complexity-report:
	.$(call os_adjust,/node_modules/.bin/cr) --minmi 20 --maxcyc 10 --maxhd 20 -n ./lib

doc:
	.$(call os_adjust,/node_modules/.bin/jsdoc) -c .jsdocrc

package: prepare
	mkdir -p pkg
	tar pczf pkg/test.tar.gz --exclude-tag-all=test.tar.gz --exclude .git/ .

publish: prepare
	npm pack
	npm publish

clean-db:
	mongo $(db_name) --eval 'printjson(db.dropDatabase())'

ci-build: prepare
	node .

ci-test: real-ci-test clean-db
real-ci-test: prepare
	rm -fv results.xml
	.$(call os_adjust,/node_modules/.bin/lab) -r junit -o results.xml -a code

ci-cov-threshold: prepare real-cov-threshold clean-db

ci-cov-report: prepare real-cov-report clean-db

ci-lint: prepare
	.$(call os_adjust,/node_modules/.bin/jshint) --reporter node_modules/jshint-stylish lib test
	.$(call os_adjust,/node_modules/.bin/jscs) --config=./.jscsrc lib
	.$(call os_adjust,/node_modules/.bin/jscs) --config=./test/.jscsrc test

ci-complexity: prepare
	-make complexity

ci-complexity-report: prepare
	-make complexity-report

ci-doc:
	.$(call os_adjust,/node_modules/.bin/jsdoc) -c .jsdocrc

ci-package: prepare
	printf "${GO_PIPELINE_LABEL}" > buildLabel
	echo "Checking for artifact setting"
	test -n "${artifact}" || exit 1
	mkdir -p pkg
	tar pczf pkg/${artifact} --exclude-tag-all=${artifact} --exclude .git/ .

ci-publish: prepare
	npm pack
	npm publish

.PHONY: default clean prepare link test test-watch spec spec-watch cov cov-watch report lint doc package publish ci-build ci-test ci-cov-threshold ci-cov-report ci-lint ci-doc ci-package ci-publish clean-db real-ci-test real-ci-cov-threshold real-ci-cov-report
