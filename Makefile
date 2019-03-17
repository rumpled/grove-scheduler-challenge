default: install dev

install:
	docker-compose -f docker-compose.builder.yml \
		run --rm install

dev:
	docker-compose up

build:
	cd ./app && \
	npm run build && \
	cd ../