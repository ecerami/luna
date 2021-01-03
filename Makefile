check: format lint test

lint:
	yarn eslint src --ext .js,.jsx,.ts,.tsx

format:
	yarn prettier .  --write

test:
	yarn test
