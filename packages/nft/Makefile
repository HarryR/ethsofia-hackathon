all:
	pnpm hardhat compile

deploy:
	pnpm hardhat --network bellecour deploy --viteenv ../frontend/.env.local

importq:
	pnpm hardhat --network bellecour makeq --input q/1.json
