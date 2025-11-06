.PHONY: install build dev
install:
	pnpm -w install
build:
	pnpm -w build
dev:
	pnpm -C frontend dev
