.PHONY: writing

writing: .github/script/node_modules
	cd .github/script/ && npm run writing

zenn: .github/script/node_modules
	cd .github/script/ && npm run zenn

deploy: build
	cd .github/script/ && npm run pages:archive && npm run deploy

build: .github/script/node_modules
	cd .github/script/ && npm run build

check: .github/script/node_modules
	cd .github/script/ && npm run check

.github/script/node_modules: .github/script/package.json .github/script/package-lock.json
	cd .github/script/ && npm ci
