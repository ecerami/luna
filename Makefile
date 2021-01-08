check: format lint test

lint:
	yarn eslint src --ext .js,.jsx,.ts,.tsx

format:
	yarn prettier .  --write

test:
	yarn test

deploy:
	yarn build
	cp build/index.html build/200.html
	surge build http://luna-alpha.surge.sh/

clean:
	rm build/*
