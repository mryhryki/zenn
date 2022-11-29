.PHONY: writing

writing: node_modules
	cd .github/script/ && npm run writing

zenn: node_modules
	cd .github/script/ && npm run zenn

deploy: build
	cd .github/script/ && npm run pages:archive && npm run deploy

build: node_modules
	cd .github/script/ && npm run build

check: node_modules
	cd .github/script/ && npm run check

node_modules: .github/script/package.json .github/script/package-lock.json
	cd .github/script/ && npm ci
