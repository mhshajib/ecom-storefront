PORT ?= 4000

.DEFAULT_GOAL := help
.PHONY: help ensure-env install dev build start preview generate clean reinstall

help: ## list available commands
	@grep -hE '^[a-zA-Z0-9_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

ensure-env:
	@test -f .env || (cp .env.example .env && echo "created .env from .env.example")

install: ensure-env ## install dependencies (npm ci when the lock file is there)
	@if [ -f package-lock.json ]; then npm ci; else npm install; fi

dev: ensure-env ## run the dev server on http://localhost:4000 (the API must be running: make run in ../ecom-api)
	@test -d node_modules || $(MAKE) install
	npm run dev

build: ensure-env ## production build into .output/
	@test -d node_modules || $(MAKE) install
	npm run build

start: ## serve the production build (make build first) on port $(PORT)
	PORT=$(PORT) node .output/server/index.mjs

preview: ## preview the production build locally
	npm run preview

clean: ## remove build output and caches
	rm -rf .output .nuxt node_modules/.cache

reinstall: ## fresh dependencies (removes node_modules)
	rm -rf node_modules && $(MAKE) install
